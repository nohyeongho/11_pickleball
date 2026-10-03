import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = Boolean(process.env.VERCEL);
const DATA_DIR = isVercel ? '/tmp/pickleball-data' : path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'tournament-db.json');

// In-memory cache for serverless environments
let inMemoryDb: TournamentDatabase | null = null;

// Interface definition for backend
export type EventType = '남자복식' | '여자복식' | '혼합복식';

export interface TournamentApplication {
  id: string;
  regNumber: string;
  division: string;
  clubName: string;
  player1Name: string;
  player1Phone: string;
  player2Name: string;
  player2Phone: string;
  depositorName: string;
  confirmPassword?: string;
  eventType: EventType;
  status: string;
  createdAt: string;
}

export interface TournamentDatabase {
  applications: TournamentApplication[];
  divisions: string[];
  capacities: Record<string, number>;
  divisionCodes: Record<string, string>;
  depositAccount: string;
  openAt?: string;
  updatedAt: string;
}

const DEFAULT_DIVISIONS: string[] = ['1부', '2부', '3부', '4부', '5부'];

const DEFAULT_CAPACITIES: Record<string, number> = {
  '1부': 16,
  '2부': 16,
  '3부': 16,
  '4부': 16,
  '5부': 16,
};

const DEFAULT_DIVISION_CODES: Record<string, string> = {
  '1부': 'A',
  '2부': 'B',
  '3부': 'C',
  '4부': 'D',
  '5부': 'E',
};

const DEFAULT_ACCOUNT = '카카오뱅크 3333-36-8513229 (피클볼대회 조직위원회)';
const MAX_WAITLIST = 4;

function sortDivisions(divisions: string[]): string[] {
  return [...divisions].sort((a, b) => {
    const matchA = a.match(/\d+/);
    const matchB = b.match(/\d+/);
    if (matchA && matchB) {
      const numA = parseInt(matchA[0], 10);
      const numB = parseInt(matchB[0], 10);
      if (numA !== numB) {
        return numA - numB;
      }
    } else if (matchA) {
      return -1;
    } else if (matchB) {
      return 1;
    }
    return a.localeCompare(b, 'ko');
  });
}

function loadDatabase(): TournamentDatabase {
  if (inMemoryDb) {
    return inMemoryDb;
  }
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(content);
      const rawDivs = Array.isArray(data.divisions) && data.divisions.length > 0 ? data.divisions : DEFAULT_DIVISIONS;
      inMemoryDb = {
        applications: Array.isArray(data.applications) ? data.applications : [],
        divisions: sortDivisions(rawDivs),
        capacities: data.capacities || DEFAULT_CAPACITIES,
        divisionCodes: data.divisionCodes || DEFAULT_DIVISION_CODES,
        depositAccount: data.depositAccount !== undefined ? data.depositAccount : DEFAULT_ACCOUNT,
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
      return inMemoryDb;
    }
    // Check bundled data file
    const bundledDbPath = path.resolve(__dirname, 'data', 'tournament-db.json');
    if (fs.existsSync(bundledDbPath)) {
      const content = fs.readFileSync(bundledDbPath, 'utf-8');
      const data = JSON.parse(content);
      const rawDivs = Array.isArray(data.divisions) && data.divisions.length > 0 ? data.divisions : DEFAULT_DIVISIONS;
      inMemoryDb = {
        applications: Array.isArray(data.applications) ? data.applications : [],
        divisions: sortDivisions(rawDivs),
        capacities: data.capacities || DEFAULT_CAPACITIES,
        divisionCodes: data.divisionCodes || DEFAULT_DIVISION_CODES,
        depositAccount: data.depositAccount !== undefined ? data.depositAccount : DEFAULT_ACCOUNT,
        openAt: data.openAt || '',
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
      saveDatabase(inMemoryDb);
      return inMemoryDb;
    }
  } catch (err) {
    console.error('Error loading database file, initializing defaults:', err);
  }

  const initialDb: TournamentDatabase = {
    applications: [
      {
        id: '1727400000000',
        regNumber: '2027-A-001',
        division: '1부',
        clubName: '부산피클볼클럽',
        player1Name: '김민수',
        player1Phone: '010-1234-5678',
        player2Name: '박지영',
        player2Phone: '010-9876-5432',
        depositorName: '김민수(1부)',
        confirmPassword: '111',
        eventType: '혼합복식',
        status: '정상 (입금대기)',
        createdAt: '2027. 3. 1. 오전 10:00:00',
      },
    ],
    divisions: DEFAULT_DIVISIONS,
    capacities: DEFAULT_CAPACITIES,
    divisionCodes: DEFAULT_DIVISION_CODES,
    depositAccount: DEFAULT_ACCOUNT,
    openAt: '',
    updatedAt: new Date().toISOString(),
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: TournamentDatabase) {
  inMemoryDb = db;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db.updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Note: File write not persisted (read-only environment), keeping in memory cache:', err);
  }
}

function getNextDivisionCode(existingCodes: Record<string, string>): string {
  const used = Object.values(existingCodes);
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    if (!used.includes(letter)) return letter;
  }
  return 'X' + Date.now().toString().slice(-3);
}

export const app = express();
let db = loadDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

  // ================= API ROUTES =================

let registrationQueue = Promise.resolve();

  app.get('/api/tournament/data', (req, res) => {
    db = loadDatabase();
    res.json({
      result: 'success',
      applications: db.applications,
      divisions: db.divisions,
      capacities: db.capacities,
      divisionCodes: db.divisionCodes,
      depositAccount: db.depositAccount,
      openAt: db.openAt || '',
      serverTime: new Date().toISOString(),
      updatedAt: db.updatedAt,
    });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), totalApplications: db.applications.length });
  });

  app.post('/api/tournament/open-time', (req, res) => {
    db = loadDatabase();
    const { openAt } = req.body;
    db.openAt = openAt !== undefined ? String(openAt).trim() : '';
    saveDatabase(db);
    res.json({ result: 'success', openAt: db.openAt });
  });

  app.post('/api/tournament/application', (req, res) => {
    registrationQueue = registrationQueue
      .then(async () => {
        db = loadDatabase();
        const {
          eventType,
          division,
          clubName,
          player1Name,
          player1Phone,
          player2Name,
          player2Phone,
          depositorName,
          confirmPassword,
        } = req.body;

        if (!division || !player1Name || !player1Phone || !player2Name || !player2Phone || !depositorName || !confirmPassword) {
          return res.status(400).json({ result: 'error', message: '필수 입력 항목이 누락되었습니다.' });
        }

        if (db.openAt) {
          const openTime = new Date(db.openAt).getTime();
          if (!isNaN(openTime) && Date.now() < openTime) {
            const openTimeStr = new Date(db.openAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
            return res.status(403).json({
              result: 'error',
              message: `대회 참가신청 접수 오픈 전입니다. (오픈 일시: ${openTimeStr})`,
            });
          }
        }

        const p1PhoneClean = String(player1Phone).replace(/[^0-9]/g, '');
        const p2PhoneClean = String(player2Phone).replace(/[^0-9]/g, '');
        const isDuplicate = db.applications.some((a) => {
          if (a.status === '취소됨') return false;
          const existP1 = String(a.player1Phone).replace(/[^0-9]/g, '');
          const existP2 = String(a.player2Phone).replace(/[^0-9]/g, '');
          return (
            (existP1 === p1PhoneClean && a.player1Name.trim() === String(player1Name).trim()) ||
            (existP2 === p2PhoneClean && a.player2Name.trim() === String(player2Name).trim())
          );
        });

        if (isDuplicate) {
          return res.status(400).json({
            result: 'error',
            message: '이미 등록된 선수 정보(성함 및 연락처)로 접수된 참가 내역이 있습니다.',
          });
        }

        const currentNormal = db.applications.filter(
          (a) => a.division === division && a.status !== '취소됨' && a.status.startsWith('정상')
        ).length;
        const maxCap = db.capacities[division] || 16;
        let status = '';

        if (currentNormal < maxCap) {
          status = '정상 (입금대기)';
        } else {
          const waitCount = db.applications.filter(
            (a) => a.division === division && a.status.includes('대기자')
          ).length;

          if (waitCount >= MAX_WAITLIST) {
            return res.status(400).json({
              result: 'error',
              message: `${division}는 정원(${maxCap}팀)과 대기팀(최대 ${MAX_WAITLIST}팀)이 모두 마감되었습니다.`,
            });
          }
          status = `대기자(순번 ${waitCount + 1}번)`;
        }

        const codeLetter = db.divisionCodes[division] || 'A';
        const divApps = db.applications.filter((a) => a.division === division);
        const serialNum = String(divApps.length + 1).padStart(3, '0');
        const regNumber = `2027-${codeLetter}-${serialNum}`;

        const newApp: TournamentApplication = {
          id: Date.now().toString(),
          regNumber,
          division,
          clubName: clubName || '소속없음',
          player1Name,
          player1Phone,
          player2Name,
          player2Phone,
          depositorName,
          confirmPassword,
          eventType: eventType || '혼합복식',
          status,
          createdAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
        };

        db.applications.push(newApp);
        saveDatabase(db);

        return res.json({
          result: 'success',
          application: newApp,
          applications: db.applications,
          depositAccount: db.depositAccount,
        });
      })
      .catch((err) => {
        console.error('Error during application atomic processing:', err);
        if (!res.headersSent) {
          return res.status(500).json({ result: 'error', message: '접수 처리 중 서버 오류가 발생했습니다.' });
        }
      });
  });

  // 4. Cancel application (with password or admin force)
  app.post('/api/tournament/cancel', (req, res) => {
    db = loadDatabase();
    const { id, password, isAdmin } = req.body;

    const target = db.applications.find((a) => a.id === id);
    if (!target) {
      return res.status(404).json({ result: 'error', message: '해당 신청 내역을 찾을 수 없습니다.' });
    }

    if (!isAdmin && target.confirmPassword !== password) {
      return res.status(401).json({ result: 'error', message: '확인용 비밀번호가 일치하지 않습니다.' });
    }

    const wasNormal = target.status.startsWith('정상');
    const division = target.division;
    target.status = '취소됨';

    // Promotion logic if normal slot opened
    if (wasNormal) {
      const waitList = db.applications.filter(
        (a) => a.division === division && a.status.includes('대기자')
      );
      if (waitList.length > 0) {
        waitList.sort((a, b) => {
          const numA = parseInt(a.status.match(/순번 (\d+)번/)?.[1] || '999', 10);
          const numB = parseInt(b.status.match(/순번 (\d+)번/)?.[1] || '999', 10);
          return numA - numB;
        });

        waitList[0].status = '정상 (입금대기)';
        waitList.slice(1).forEach((w, idx) => {
          w.status = `대기자(순번 ${idx + 1}번)`;
        });
      }
    } else if (target.status.includes('대기자')) {
      const waitList = db.applications.filter(
        (a) => a.division === division && a.status.includes('대기자') && a.id !== id
      );
      waitList.sort((a, b) => {
        const numA = parseInt(a.status.match(/순번 (\d+)번/)?.[1] || '999', 10);
        const numB = parseInt(b.status.match(/순번 (\d+)번/)?.[1] || '999', 10);
        return numA - numB;
      });
      waitList.forEach((w, idx) => {
        w.status = `대기자(순번 ${idx + 1}번)`;
      });
    }

    saveDatabase(db);
    res.json({ result: 'success', message: '취소 처리가 완료되었습니다.', applications: db.applications });
  });

  // 5. Toggle deposit status (Admin)
  app.post('/api/tournament/deposit-status', (req, res) => {
    db = loadDatabase();
    const { id } = req.body;

    const target = db.applications.find((a) => a.id === id);
    if (!target) {
      return res.status(404).json({ result: 'error', message: '신청 내역을 찾을 수 없습니다.' });
    }

    if (target.status.includes('입금확인완료')) {
      target.status = '정상 (입금대기)';
    } else if (target.status.startsWith('정상')) {
      target.status = '정상 (입금확인완료)';
    } else {
      return res.status(400).json({ result: 'error', message: '대기자 또는 취소된 건은 입금 상태를 변경할 수 없습니다.' });
    }

    saveDatabase(db);
    res.json({ result: 'success', application: target, applications: db.applications });
  });

  // 6. Update division list (Admin)
  app.post('/api/tournament/divisions', (req, res) => {
    db = loadDatabase();
    const { divisions, capacities, divisionCodes, applications } = req.body;

    if (Array.isArray(divisions) && divisions.length > 0) {
      db.divisions = sortDivisions([...new Set(divisions.map((d: string) => String(d).trim()).filter(Boolean))]);
    }
    if (capacities && typeof capacities === 'object') {
      db.capacities = capacities;
    }
    if (divisionCodes && typeof divisionCodes === 'object') {
      db.divisionCodes = divisionCodes;
    }
    if (Array.isArray(applications)) {
      db.applications = applications;
    }

    saveDatabase(db);
    res.json({
      result: 'success',
      divisions: db.divisions,
      capacities: db.capacities,
      divisionCodes: db.divisionCodes,
      applications: db.applications,
    });
  });

  // 7. Update single division capacity (Admin)
  app.post('/api/tournament/capacity', (req, res) => {
    db = loadDatabase();
    const { division, capacity } = req.body;
    const numCap = parseInt(capacity, 10);

    if (!division || isNaN(numCap) || numCap < 1) {
      return res.status(400).json({ result: 'error', message: '올바른 부수와 정원 숫자를 입력해 주세요.' });
    }

    db.capacities[division] = numCap;

    // Check if new capacity allows promoting waitlist
    const currentNormal = db.applications.filter(
      (a) => a.division === division && a.status !== '취소됨' && a.status.startsWith('정상')
    ).length;

    let availableSlots = numCap - currentNormal;
    if (availableSlots > 0) {
      const waitList = db.applications.filter(
        (a) => a.division === division && a.status.includes('대기자')
      );
      waitList.sort((a, b) => {
        const numA = parseInt(a.status.match(/순번 (\d+)번/)?.[1] || '999', 10);
        const numB = parseInt(b.status.match(/순번 (\d+)번/)?.[1] || '999', 10);
        return numA - numB;
      });

      while (availableSlots > 0 && waitList.length > 0) {
        const promoted = waitList.shift();
        if (promoted) {
          promoted.status = '정상 (입금대기)';
          availableSlots--;
        }
      }

      // Re-number remaining waitlist
      waitList.forEach((w, idx) => {
        w.status = `대기자(순번 ${idx + 1}번)`;
      });
    }

    saveDatabase(db);
    res.json({
      result: 'success',
      capacities: db.capacities,
      applications: db.applications,
    });
  });

  // 8. Update Bank Deposit Account (Admin)
  app.post('/api/tournament/account', (req, res) => {
    db = loadDatabase();
    const { depositAccount } = req.body;
    db.depositAccount = depositAccount !== undefined ? depositAccount.trim() : '';
    saveDatabase(db);
    res.json({ result: 'success', depositAccount: db.depositAccount });
  });

  // 9. Reset or clean database (Admin)
  app.post('/api/tournament/reset', (req, res) => {
    const { confirmText } = req.body;
    if (confirmText !== '초기화') {
      return res.status(400).json({ result: 'error', message: "확인 문구('초기화')가 일치하지 않습니다." });
    }

    db = {
      applications: [],
      divisions: DEFAULT_DIVISIONS,
      capacities: { ...DEFAULT_CAPACITIES },
      divisionCodes: { ...DEFAULT_DIVISION_CODES },
      depositAccount: DEFAULT_ACCOUNT,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(db);

    res.json({
      result: 'success',
      message: '서버 데이터가 기본 상태로 초기화되었습니다.',
      data: db,
    });
  });

// ================= VITE MIDDLEWARE / STATIC FILES =================

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Tournament server listening on 0.0.0.0:${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

if (!isVercel && process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => {
    console.error('Fatal error starting server:', err);
    process.exit(1);
  });
}

export default app;
