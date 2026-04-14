/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import { db, auth } from './firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  setDoc, 
  doc,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const ALL_STUDENTS_DATA = [
  { nama: 'ADEEBA RUSHD BINTI KHAIRUL RUSDI', ic: 'CK230151', huruf: 'J', form: '4C' },
  { nama: 'AMIRUL NAUFAL BIN MUHAMAD HIZMI @ AZMI', ic: 'CK230113', huruf: 'K', form: '4C' },
  { nama: 'AREEFA RUSHD BINTI KHAIRUL RUSDI', ic: 'CK230028', huruf: 'E', form: '4C' },
  { nama: 'DARISH IKHMAL BIN ANAS AUSINSAUBAN', ic: 'CK230027', huruf: 'E', form: '4C' },
  { nama: 'DURRATUL IMAN BINTI MOHD NAZORI', ic: 'CK230119', huruf: 'C', form: '4C' },
  { nama: 'EMAD EDDIN BIN SYARULAZLEE', ic: 'CK230041', huruf: 'A', form: '4C' },
  { nama: 'HUSNA AILYN BINTI MUHAMMAD FIRDAUS', ic: 'CK230088', huruf: 'J', form: '4C' },
  { nama: 'KHALIF NAUFAIL BIN REIMI IRWAN', ic: 'CK230081', huruf: 'F', form: '4C' },
  { nama: 'MUHAMAD ADAM ZUHAIR BIN MOHD NAJIB', ic: 'CK230058', huruf: 'K', form: '4C' },
  { nama: 'MUHAMMAD AMEER SYAHMI BIN AHMAD SHAHRIL RIZAL', ic: 'CK230044', huruf: 'G', form: '4C' },
  { nama: 'MUHAMMAD FAHIM BIN SAIFULLIZAN', ic: 'CK230075', huruf: 'D', form: '4C' },
  { nama: 'MUHAMMAD IKRAM NUR WAIE BIN CIK ROSLAN', ic: 'CK230065', huruf: 'C', form: '4C' },
  { nama: 'NAJWATUL HAYATI BINTI MUHAMMAD NU\'AIM', ic: 'CK230033', huruf: 'I', form: '4C' },
  { nama: 'NUR ALIA MAISARA BINTI MOHD FAHRUL', ic: 'CK230068', huruf: 'D', form: '4C' },
  { nama: 'NUR ARIEANA SUFFIAH BINTI MOHD ARIZOLHADI', ic: 'CK230038', huruf: 'E', form: '4C' },
  { nama: 'NUR AZFAR HUSNA BINTI MOHAMMAD SAFARUDDIN', ic: 'CK230153', huruf: 'F', form: '4C' },
  { nama: 'NUR JANNAH BINTI ZUBER', ic: 'CK230134', huruf: 'H', form: '4C' },
  { nama: 'NURMAWADDAH FATINAH BINTI FAIRUL SHAM SUHARDI', ic: 'CK230155', huruf: 'L', form: '4C' },
  { nama: 'PUTRA NAZIH MUKHRIZ BIN ABDULLAH', ic: 'CK230157', huruf: 'L', form: '4C' },
  { nama: 'RABIATUL KAISAH BINTI LANJUT MOHD KASIM', ic: 'CK230117', huruf: 'C', form: '4C' },
  { nama: 'SUCI SYAHIRAH BINTI HASRULAMRY', ic: 'CK230014', huruf: 'H', form: '4C' },
  { nama: 'ALESSYA NUR RAIHANAH BINTI RIDZUAN', ic: 'CK230107', huruf: 'L', form: '4E' },
  { nama: 'ARIQ RAYYAN BIN MUHAMMAD SALIMI', ic: 'CK230032', huruf: 'I', form: '4E' },
  { nama: 'ARISSA ZARA BINTI SHAIFUL ADRIE', ic: 'CK230106', huruf: 'J', form: '4E' },
  { nama: 'FATHIMAH AZZAHRA BINTI SUKRI', ic: 'CK230120', huruf: 'H', form: '4E' },
  { nama: 'HAZWAN FIKRI BIN HISYAM BADRULRAFAIE', ic: 'CK230150', huruf: 'J', form: '4E' },
  { nama: 'MOHAMAD SYAFIQ BIN MD SOFIAN', ic: 'CK230128', huruf: 'B', form: '4E' },
  { nama: 'MUHAMMAD ADYAN MUSTAKIM BIN ZUHAN', ic: 'CK230095', huruf: 'A', form: '4E' },
  { nama: 'MUHAMMAD AIDIT PUTRA BIN ABDULLAH', ic: 'CK230132', huruf: 'D', form: '4E' },
  { nama: 'MUHAMMAD FARISH ADAM BIN MOHD FIRDAUS', ic: 'CK230008', huruf: 'D', form: '4E' },
  { nama: 'MUHAMMAD IMRAN DANIAL BIN MOHD HARIZAN', ic: 'CK230139', huruf: 'G', form: '4E' },
  { nama: 'MUHAMMAD SYAKEER HUSSAINI BIN MOHD SALIHEN', ic: 'CK230137', huruf: 'F', form: '4E' },
  { nama: 'NUR AFRINA MARSYELLA BINTI ABDUL HAKIM', ic: 'CK230103', huruf: 'B', form: '4E' },
  { nama: 'NUR ALIEYA NATASYA BINTI NORAZMI', ic: 'CK230055', huruf: 'E', form: '4E' },
  { nama: 'NUR AUFA DARWEESYA BINTI BADARUDDIN', ic: 'CK230104', huruf: 'I', form: '4E' },
  { nama: 'NUR AUNI SOFFEA BINTI MOHAMMAD SKURI', ic: 'CK230076', huruf: 'C', form: '4E' },
  { nama: 'NUR BATRISYA ERYNA BINTI MOHD HAFEZ ANUWAR', ic: 'CK230121', huruf: 'H', form: '4E' },
  { nama: 'NUR FATTEENI NAYLI BINTI MUHAMAD FAUZI', ic: 'CK230130', huruf: 'C', form: '4E' },
  { nama: 'NUR SYAZA ANEESA BINTI MUHAMMAD ROSZAIME', ic: 'CK230086', huruf: 'D', form: '4E' },
  { nama: 'QAIREEN NUHA BINTI KALANA', ic: 'CK230074', huruf: 'A', form: '4E' },
  { nama: 'WAN MUHAMMAD IDIL ADHA BIN WAN MOHD NORUDDIN', ic: 'CK230116', huruf: 'F', form: '4E' },
  { nama: 'ZAARA QISTINA BINTI WAN AHMAD YUSOF', ic: 'CK230045', huruf: 'A', form: '4E' },
  { nama: 'AHMAD ZAFRI BIN SUPIAN SAURI', ic: 'CK220108', huruf: 'G', form: '5B' },
  { nama: 'AINUL SYAFIQAH BINTI MOHD SHUHAIRI', ic: 'CK220106', huruf: 'L', form: '5B' },
  { nama: 'DANIA UMAIRAH BINTI MOHD IZWAN', ic: 'CK220099', huruf: 'C', form: '5B' },
  { nama: 'HARIZ QUSAIRY BIN AZHAN', ic: 'CK220124', huruf: 'E', form: '5B' },
  { nama: 'LOCHANNA A/P TANASEGARAN', ic: 'CK220007', huruf: 'J', form: '5B' },
  { nama: 'MIKHAIL RAYYAN BIN MOHD NOR ABDILLAH', ic: 'CK220051', huruf: 'J', form: '5B' },
  { nama: 'MUHAMMAD BIN ADZHAR', ic: 'CK220008', huruf: 'E', form: '5B' },
  { nama: 'MUHAMMAD IKHWAN BIN RAMLAN', ic: 'CK220020', huruf: 'K', form: '5B' },
  { nama: 'NORFAIQAH ZIHNI BINTI ZAINAL KARIB', ic: 'CK220072', huruf: 'K', form: '5B' },
  { nama: 'NUR AINA SYAKIRAH BINTI MOHD HAIDIR', ic: 'CK220100', huruf: 'A', form: '5B' },
  { nama: 'NUR AUNI QISMINA BINTI RAZLI', ic: 'CK220070', huruf: 'H', form: '5B' },
  { nama: 'NUR HASYA BINTI MOHD ISRAF', ic: 'CK220120', huruf: 'G', form: '5B' },
  { nama: 'NURHANI BATRISYIA BINTI ABU BAKAR', ic: 'CK220140', huruf: 'L', form: '5B' },
  { nama: 'PUTERI AIRIN ERYANA BINTI ABDULLAH', ic: 'CK220134', huruf: 'D', form: '5B' },
  { nama: 'PUTRI NUR ADRIANNA BALQIS BINTI MUHAMAD HAFIZAN', ic: 'CK220025', huruf: 'H', form: '5B' },
  { nama: 'PUTRI QAIREESYA BINTI MOHAMAD ZULKHARNAIN', ic: 'CK220090', huruf: 'J', form: '5B' },
  { nama: 'SHAILESH NAIDU A/L NADARAJAN', ic: 'CK220005', huruf: 'E', form: '5B' },
  { nama: 'SITI NURIN NABILAH BINTI J MISNORDIN', ic: 'CK220021', huruf: 'A', form: '5B' },
  { nama: 'YUSOFF DANIELL BIN YUSNIZAM', ic: 'CK220003', huruf: 'J', form: '5B' }
];

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // Don't throw, just return info so we can handle it in UI if needed
  return errInfo;
}

export default function App() {
  const [view, setView] = useState<'selection' | 'login-pelajar' | 'login-guru' | 'dashboard-pelajar' | 'dashboard-guru'>(() => {
    const saved = localStorage.getItem('bijak_rumus_view');
    return (saved as any) || 'selection';
  });
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('bijak_rumus_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentSet, setCurrentSet] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'kerja' | 'arkib'>(() => {
    const saved = localStorage.getItem('bijak_rumus_active_tab');
    return (saved as any) || 'kerja';
  });
  const [activeGuruTab, setActiveGuruTab] = useState<'daftar' | 'soalan' | 'penanda' | 'analisis'>(() => {
    const saved = localStorage.getItem('bijak_rumus_active_guru_tab');
    return (saved as any) || 'daftar';
  });
  
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null);
  const [wordCount, setWordCount] = useState(0);
  
  // Form States
  const [pelajarNama, setPelajarNama] = useState('');
  const [pelajarPass, setPelajarPass] = useState('');
  const [guruPass, setGuruPass] = useState('');
  const [jawapanText, setJawapanText] = useState('');
  
  // Guru Form States
  const [guruSetNum, setGuruSetNum] = useState('');
  const [guruArahan, setGuruArahan] = useState('');
  const [guruBahan1, setGuruBahan1] = useState('');
  const [guruBahan2, setGuruBahan2] = useState('');
  const [guruBahan3, setGuruBahan3] = useState('');
  const [importArea, setImportArea] = useState('');
  
  // Penanda States
  const [penandaPelajar, setPenandaPelajar] = useState('');
  const [penandaSet, setPenandaSet] = useState('');
  const [markingSession, setMarkingSession] = useState<any>(null);
  const [marksInput, setMarksInput] = useState({ p: 0, a: 0, b: 0, c: 0, d: 0, e: 0, k: 0, bah: 0 });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);

  // Persist session
  useEffect(() => {
    localStorage.setItem('bijak_rumus_view', view);
    localStorage.setItem('bijak_rumus_active_tab', activeTab);
    localStorage.setItem('bijak_rumus_active_guru_tab', activeGuruTab);
    if (currentUser) {
      localStorage.setItem('bijak_rumus_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bijak_rumus_user');
    }
  }, [view, currentUser, activeTab, activeGuruTab]);

  useEffect(() => {
    // Auto-login anonymously to allow Firestore access
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
      if (!u) {
        signInAnonymously(auth).catch(console.error);
      }
    });

    // Max loading time 1.5s for better UX
    const timer = setTimeout(() => setLoading(false), 1500);

    return () => {
      unsubAuth();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    // Only start listeners if authenticated
    if (!user) return;

    // Real-time listeners
    const unsubStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.error("Students listener error:", err);
      showToast("Gagal memuat data pelajar!", "bg-red-500");
    });

    const unsubQuestions = onSnapshot(collection(db, 'questions'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Questions updated:", data.length, "items");
      setQuestions(data);
    }, (err) => {
      console.error("Questions listener error:", err);
      showToast("Gagal memuat soalan!", "bg-red-500");
    });

    const unsubAnswers = onSnapshot(collection(db, 'answers'), (snapshot) => {
      setAnswers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.error("Answers listener error:", err);
    });

    const unsubMarks = onSnapshot(collection(db, 'marks'), (snapshot) => {
      setMarks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.error("Marks listener error:", err);
    });

    // Set loading to false once auth is ready and listeners are attached
    // We don't necessarily need to wait for all data to arrive to show the selection screen
    setLoading(false);

    return () => {
      unsubStudents();
      unsubQuestions();
      unsubAnswers();
      unsubMarks();
    };
  }, [user]);

  const showToast = (msg: string, color: string) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLoginPelajar = () => {
    if (!pelajarNama || !pelajarPass) return showToast("Sila lengkapkan maklumat!", "bg-red-500");
    
    // Check Firestore first, then fallback to hardcoded list
    let student = students.find(s => s.name === pelajarNama);
    if (!student) {
      const fallback = ALL_STUDENTS_DATA.find(s => s.nama === pelajarNama);
      if (fallback) {
        student = { id: fallback.ic, name: fallback.nama, ic: fallback.ic, class: fallback.form, password: fallback.ic };
      }
    }

    if (!student) return showToast("Nama tidak dijumpai!", "bg-red-500");
    
    if (student.password === pelajarPass) {
      setCurrentUser(student);
      setView('dashboard-pelajar');
    } else {
      showToast("Kata laluan salah!", "bg-red-500");
    }
  };

  const handleLoginGuru = () => {
    if (guruPass === 'guru1') {
      setCurrentUser({ name: 'Guru Admin', role: 'guru' });
      setView('dashboard-guru');
    } else {
      showToast("Kata laluan salah!", "bg-red-500");
    }
  };

  const handleRefresh = () => {
    showToast("Data sedang dikemaskini...", "bg-indigo-600");
    // Firestore listeners are real-time, so we don't need to do much
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('selection');
    localStorage.removeItem('bijak_rumus_view');
    localStorage.removeItem('bijak_rumus_user');
    localStorage.removeItem('bijak_rumus_active_tab');
    localStorage.removeItem('bijak_rumus_active_guru_tab');
  };

  const selectSet = (num: number) => {
    setCurrentSet(num);
    const q = questions.find(item => item.setNumber === num);
    if (!q) {
      setJawapanText('');
    } else {
      // Check if already answered
      const existing = answers.find(a => a.studentId === currentUser.id && a.setNumber === num);
      setJawapanText(existing ? existing.content : '');
    }
  };

  const updateWordCount = (text: string) => {
    setJawapanText(text);
    const count = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(count);
  };

  const saveJawapan = async () => {
    if (!jawapanText) return showToast("Jawapan kosong!", "bg-red-500");
    if (!currentSet) return showToast("Pilih set latihan!", "bg-red-500");
    
    const payload = {
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentClass: currentUser.class,
      setNumber: currentSet,
      content: jawapanText,
      timestamp: new Date().toISOString()
    };

    showToast("Sedang menghantar...", "bg-blue-500");
    try {
      await setDoc(doc(db, 'answers', `ans_${currentUser.id}_${currentSet}`), payload);
      showToast("Jawapan berjaya disimpan!", "bg-green-600");
      // Reset form
      setJawapanText('');
      setWordCount(0);
      setCurrentSet(null);
    } catch (e) {
      console.error("Error saving answer:", e);
      showToast("Gagal menyimpan!", "bg-red-500");
    }
  };

  const handleEditAnswer = (answer: any) => {
    setCurrentSet(answer.setNumber);
    setJawapanText(answer.content);
    updateWordCount(answer.content);
    setActiveTab('kerja');
    showToast(`Mengedit Set ${answer.setNumber}`, "bg-indigo-600");
  };

  const handleBulkImport = async () => {
    const lines = importArea.split('\n').filter(l => l.trim());
    showToast("Sedang mengimport...", "bg-blue-500");
    try {
      for (const line of lines) {
        const [nama, ic, huruf, form] = line.split('\t');
        await addDoc(collection(db, 'students'), {
          name: nama,
          ic: ic,
          class: form,
          password: ic // Default password is IC
        });
      }
      showToast("Import berjaya!", "bg-green-600");
      setImportArea('');
    } catch (e) {
      showToast("Gagal mengimport!", "bg-red-500");
    }
  };

  const handleSaveSoalan = async () => {
    if (!guruSetNum) return showToast("Pilih set soalan!", "bg-red-500");
    const payload = {
      setNumber: parseInt(guruSetNum),
      instruction: guruArahan,
      text1: guruBahan1,
      image2: guruBahan2,
      image3: guruBahan3
    };
    
    console.log("Saving question payload:", payload);
    showToast("Sedang menyimpan...", "bg-blue-500");
    
    try {
      // Use setDoc with a fixed ID to overwrite instead of duplicating
      await setDoc(doc(db, 'questions', `set_${guruSetNum}`), payload);
      showToast("Soalan berjaya disimpan!", "bg-green-600");
      // Clear form
      setGuruSetNum('');
      setGuruArahan('');
      setGuruBahan1('');
      setGuruBahan2('');
      setGuruBahan3('');
    } catch (e) {
      console.error("Error saving question:", e);
      showToast("Gagal menyimpan! Sila semak konsol.", "bg-red-500");
      try {
        handleFirestoreError(e, OperationType.WRITE, 'questions');
      } catch (err) {
        // Logged
      }
    }
  };

  const handleDeleteSoalan = async (id: string) => {
    showToast("Sedang memadam...", "bg-amber-500");
    try {
      await deleteDoc(doc(db, 'questions', id));
      showToast("Soalan berjaya dipadam!", "bg-green-600");
      setConfirmDeleteId(null);
    } catch (e) {
      console.error("Error deleting question:", e);
      showToast("Gagal memadam! Sila semak konsol.", "bg-red-500");
    }
  };

  const loadMarkingSession = () => {
    const ans = answers.find(a => a.studentName === penandaPelajar && a.setNumber === parseInt(penandaSet));
    if (ans) {
      setMarkingSession(ans);
    } else {
      showToast("Jawapan tidak ditemui!", "bg-red-500");
    }
  };

  const handleSaveMarkah = async () => {
    const { p, a, b, c, d, e, k, bah } = marksInput;
    const ideaTotal = (p + a + b + c + d + e + k) * 2;
    const grandTotal = Math.min(ideaTotal + bah, 30);
    
    const payload = {
      answerId: markingSession.id,
      studentId: markingSession.studentId,
      setNumber: markingSession.setNumber,
      p, a, b, c, d, e, k,
      ideaTotal,
      bahMark: bah,
      grandTotal
    };

    try {
      await addDoc(collection(db, 'marks'), payload);
      showToast("Markah disimpan!", "bg-green-600");
      setMarkingSession(null);
    } catch (e) {
      console.error("Error saving mark:", e);
      showToast("Gagal menyimpan!", "bg-red-500");
      try {
        handleFirestoreError(e, OperationType.WRITE, 'marks');
      } catch (err) {
        // Logged
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/80 z-[100] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-800 font-bold">Memuatkan Sistem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-screen">
      
      {/* SKRIN PILIHAN MOD */}
      {view === 'selection' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-indigo-700 mb-2 tracking-tight">📚 BIJAK RUMUS</h1>
            <p className="text-xl text-indigo-600">Buku Latihan Digital Rumusan SPM</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <button onClick={() => setView('login-pelajar')} className="mode-btn px-12 py-8 bg-white border-2 border-blue-500 text-blue-600 text-2xl font-bold rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all"> 👨‍🎓 PELAJAR </button>
            <button onClick={() => setView('login-guru')} className="mode-btn px-12 py-8 bg-white border-2 border-amber-500 text-amber-600 text-2xl font-bold rounded-2xl shadow-xl hover:bg-amber-600 hover:text-white transition-all"> 👨‍🏫 GURU </button>
          </div>
        </div>
      )}

      {/* DAFTAR MASUK PELAJAR */}
      {view === 'login-pelajar' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">DAFTAR MASUK PELAJAR</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Nama Anda:</label>
                <select 
                  value={pelajarNama}
                  onChange={(e) => setPelajarNama(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 outline-none"
                >
                  <option value="">-- Pilih Nama --</option>
                  {/* Combine Firestore students and hardcoded students, removing duplicates by name */}
                  {Array.from(new Set([...students.map(s => s.name), ...ALL_STUDENTS_DATA.map(s => s.nama)]))
                    .sort((a, b) => a.localeCompare(b))
                    .map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))
                  }
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kelas:</label>
                  <input 
                    type="text" 
                    value={students.find(s => s.name === pelajarNama)?.class || ALL_STUDENTS_DATA.find(s => s.nama === pelajarNama)?.form || ''} 
                    readOnly 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. IC/Maktab:</label>
                  <input 
                    type="text" 
                    value={students.find(s => s.name === pelajarNama)?.ic || ALL_STUDENTS_DATA.find(s => s.nama === pelajarNama)?.ic || ''} 
                    readOnly 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kata Laluan:</label>
                <input 
                  type="password" 
                  value={pelajarPass}
                  onChange={(e) => setPelajarPass(e.target.value)}
                  placeholder="Masukkan kata laluan anda" 
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 outline-none" 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setView('selection')} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl">Kembali</button>
                <button onClick={handleLoginPelajar} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg">Masuk</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AKSES GURU */}
      {view === 'login-guru' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-amber-100">
            <h2 className="text-2xl font-bold text-amber-700 mb-6 text-center">AKSES GURU</h2>
            <div className="space-y-4">
              <input 
                type="password" 
                value={guruPass}
                onChange={(e) => setGuruPass(e.target.value)}
                placeholder="Kata laluan guru" 
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 outline-none" 
              />
              <div className="flex gap-3">
                <button onClick={() => setView('selection')} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl">Kembali</button>
                <button onClick={handleLoginGuru} className="flex-1 py-3 bg-amber-600 text-white font-bold rounded-xl shadow-lg">Akses</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD PELAJAR */}
      {view === 'dashboard-pelajar' && (
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-indigo-700 rounded-2xl shadow-xl p-6 mb-6 text-white flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">BIJAK RUMUS</h1>
                <p className="text-indigo-100 text-sm">{currentUser?.name} | {currentUser?.class}</p>
              </div>
              <button onClick={handleLogout} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm">🚪 Keluar</button>
            </div>

            <div className="flex gap-4 mb-6 items-center">
              <button onClick={() => setActiveTab('kerja')} className={`px-6 py-2 font-bold rounded-full ${activeTab === 'kerja' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200'}`}>✏️ Latihan</button>
              <button onClick={() => setActiveTab('arkib')} className={`px-6 py-2 font-bold rounded-full ${activeTab === 'arkib' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200'}`}>📂 Arkib</button>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-indigo-400 font-mono">Soalan: {questions.length}</span>
                <button onClick={handleRefresh} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-indigo-600" title="Refresh Data">🔄</button>
              </div>
            </div>

            {activeTab === 'kerja' ? (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold mb-4 text-gray-800">Pilih Set Latihan:</h3>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                      <button 
                        key={num}
                        onClick={() => selectSet(num)}
                        className={`w-10 h-10 flex items-center justify-center font-bold border-2 rounded-lg text-sm transition-all ${currentSet === num ? 'bg-indigo-600 text-white border-indigo-600' : 'hover:border-indigo-300'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {currentSet && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                          <h4 className="font-bold text-blue-700 mb-1">ARAHAN:</h4>
                          <p className="text-gray-700 text-sm italic">{questions.find(q => q.setNumber === currentSet)?.instruction || 'Tiada arahan disediakan.'}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">BAHAN 1: PETIKAN</h4>
                          <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                            {questions.find(q => q.setNumber === currentSet)?.text1 || 'Soalan belum sedia.'}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-white p-4 rounded-2xl border">
                              <h4 className="text-xs font-bold text-gray-400 mb-2">BAHAN 2</h4>
                              {questions.find(q => q.setNumber === currentSet)?.image2 && (
                                <img src={questions.find(q => q.setNumber === currentSet).image2} className="w-full rounded shadow-sm" />
                              )}
                           </div>
                           <div className="bg-white p-4 rounded-2xl border">
                              <h4 className="text-xs font-bold text-gray-400 mb-2">BAHAN 3</h4>
                              {questions.find(q => q.setNumber === currentSet)?.image3 && (
                                <img src={questions.find(q => q.setNumber === currentSet).image3} className="w-full rounded shadow-sm" />
                              )}
                           </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
                        <h4 className="font-bold text-gray-800 mb-4 flex justify-between items-center">
                          RUANG JAWAPAN 
                          <span className={`text-xs px-3 py-1 rounded-full ${wordCount > 120 ? 'text-red-600 bg-red-50 font-bold' : 'text-indigo-600 bg-indigo-50'}`}>
                            {wordCount} / 120 patah perkataan
                          </span>
                        </h4>
                        <textarea 
                          value={jawapanText}
                          onChange={(e) => updateWordCount(e.target.value)}
                          className="flex-grow w-full p-4 border-2 border-indigo-100 rounded-2xl focus:border-indigo-500 outline-none text-sm leading-relaxed resize-none" 
                          placeholder="Taip rumusan lengkap anda di sini..."
                        />
                        <div className="mt-4 flex gap-3">
                          <button 
                            onClick={() => setShowPreview(true)}
                            className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200"
                          >
                            👁️ Preview
                          </button>
                          <button onClick={saveJawapan} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700">💾 Simpan</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showPreview && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                      <div className="p-6 border-b flex justify-between items-center bg-indigo-600 text-white">
                        <h3 className="font-bold text-xl">Preview Jawapan (Set {currentSet})</h3>
                        <button onClick={() => setShowPreview(false)} className="text-white hover:text-indigo-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-8 overflow-y-auto bg-gray-50">
                        <div className="bg-white p-8 rounded-2xl shadow-inner border border-gray-100 min-h-[300px]">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                            {jawapanText || <span className="text-gray-400 italic">Tiada jawapan ditulis lagi...</span>}
                          </p>
                        </div>
                        <div className="mt-6 flex justify-between items-center text-sm">
                          <span className="text-gray-500">Jumlah Perkataan: <span className="font-bold text-indigo-600">{wordCount}</span></span>
                          <button 
                            onClick={() => setShowPreview(false)}
                            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                          >
                            Tutup Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                 <h3 className="font-bold text-xl mb-4">Arkib Latihan Anda</h3>
                 <div className="space-y-4">
                    {answers.filter(a => a.studentId === currentUser.id).length > 0 ? (
                      answers.filter(a => a.studentId === currentUser.id).map(a => (
                        <div key={a.id} className="p-4 bg-gray-50 rounded-xl border flex justify-between items-center">
                          <div>
                            <h4 className="font-bold">Set {a.setNumber}</h4>
                            <p className="text-xs text-gray-500">{new Date(a.timestamp).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {marks.find(m => m.answerId === a.id) && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                Markah: {marks.find(m => m.answerId === a.id).grandTotal}/30
                              </span>
                            )}
                            <button 
                              onClick={() => handleEditAnswer(a)}
                              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-200"
                            >
                              ✏️ Edit
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400 py-10">Tiada latihan dihantar.</p>
                    )}
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PANEL GURU */}
      {view === 'dashboard-guru' && (
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-amber-600 rounded-2xl shadow-xl p-6 mb-6 text-white flex justify-between items-center">
              <h1 className="text-2xl font-bold">BIJAK RUMUS: PANEL GURU</h1>
              <button onClick={handleLogout} className="px-4 py-2 bg-white/20 rounded-lg">🚪 Keluar</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
               <button onClick={() => setActiveGuruTab('daftar')} className={`p-4 bg-white rounded-xl shadow-sm hover:shadow-md border-b-4 font-bold ${activeGuruTab === 'daftar' ? 'border-green-500' : 'border-transparent'}`}>👥 Daftar Pelajar</button>
               <button onClick={() => setActiveGuruTab('soalan')} className={`p-4 bg-white rounded-xl shadow-sm hover:shadow-md border-b-4 font-bold ${activeGuruTab === 'soalan' ? 'border-amber-500' : 'border-transparent'}`}>➕ Bina Soalan</button>
               <button onClick={() => setActiveGuruTab('penanda')} className={`p-4 bg-white rounded-xl shadow-sm hover:shadow-md border-b-4 font-bold ${activeGuruTab === 'penanda' ? 'border-orange-500' : 'border-transparent'}`}>✅ Semak Jawapan</button>
               <button onClick={() => setActiveGuruTab('analisis')} className={`p-4 bg-white rounded-xl shadow-sm hover:shadow-md border-b-4 font-bold ${activeGuruTab === 'analisis' ? 'border-red-500' : 'border-transparent'}`}>📊 Analisis TP</button>
            </div>
            
            <div className="flex justify-end mb-4 gap-4 items-center">
               <span className="text-xs text-gray-400 font-mono">Status DB: {user ? 'Berhubung' : 'Terputus'} | Soalan: {questions.length}</span>
               <button onClick={handleRefresh} className="px-3 py-1 bg-white border rounded-lg text-xs font-bold hover:bg-gray-50">🔄 Segarkan Data</button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
               {activeGuruTab === 'daftar' && (
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold">Import Senarai Pelajar</h3>
                    <p className="text-sm text-gray-500">Format: Nama [TAB] No_IC [TAB] Huruf [TAB] Kelas</p>
                    <textarea 
                      value={importArea}
                      onChange={(e) => setImportArea(e.target.value)}
                      className="w-full h-48 p-4 border rounded-xl font-mono text-sm" 
                      placeholder="Tampal dari Excel di sini..."
                    />
                    <button onClick={handleBulkImport} className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl">Proses Import</button>
                    
                    <div className="mt-8">
                      <h4 className="font-bold mb-4">Senarai Pelajar Terdaftar ({students.length})</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="py-2">Nama</th>
                              <th className="py-2">IC</th>
                              <th className="py-2">Kelas</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.sort((a,b) => a.name.localeCompare(b.name)).map(s => (
                              <tr key={s.id} className="border-b hover:bg-gray-50">
                                <td className="py-2">{s.name}</td>
                                <td className="py-2">{s.ic}</td>
                                <td className="py-2">{s.class}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                 </div>
               )}

               {activeGuruTab === 'soalan' && (
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold">Bina/Kemaskini Set Soalan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <select 
                        value={guruSetNum}
                        onChange={(e) => setGuruSetNum(e.target.value)}
                        className="p-3 border rounded-lg"
                       >
                          <option value="">-- Pilih Set (1-30) --</option>
                          {Array.from({length: 30}, (_, i) => i+1).map(n => <option key={n} value={n}>Set {n}</option>)}
                       </select>
                       <input 
                        type="text" 
                        value={guruArahan}
                        onChange={(e) => setGuruArahan(e.target.value)}
                        placeholder="Arahan Soalan" 
                        className="p-3 border rounded-lg" 
                       />
                    </div>
                    <textarea 
                      value={guruBahan1}
                      onChange={(e) => setGuruBahan1(e.target.value)}
                      className="w-full h-40 p-3 border rounded-lg" 
                      placeholder="Isi Petikan Bahan 1..."
                    />
                    <input 
                      type="text" 
                      value={guruBahan2}
                      onChange={(e) => setGuruBahan2(e.target.value)}
                      placeholder="URL Imej Bahan 2" 
                      className="w-full p-3 border rounded-lg" 
                    />
                    <input 
                      type="text" 
                      value={guruBahan3}
                      onChange={(e) => setGuruBahan3(e.target.value)}
                      placeholder="URL Imej Bahan 3" 
                      className="w-full p-3 border rounded-lg" 
                    />
                    <button onClick={handleSaveSoalan} className="w-full py-4 bg-amber-600 text-white font-bold rounded-xl">Simpan Soalan</button>
                    
                    <div className="mt-8">
                       <h4 className="font-bold mb-4">Senarai Soalan Berdaftar ({questions.length})</h4>
                       <div className="grid grid-cols-1 gap-3">
                          {questions.sort((a,b) => a.setNumber - b.setNumber).map(q => (
                            <div key={q.id} className="p-4 bg-gray-50 rounded-xl border flex justify-between items-center">
                               <div>
                                  <span className="font-bold text-amber-700">Set {q.setNumber}</span>
                                  <p className="text-xs text-gray-500 truncate max-w-md">{q.instruction}</p>
                               </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      setGuruSetNum(q.setNumber.toString());
                                      setGuruArahan(q.instruction);
                                      setGuruBahan1(q.text1);
                                      setGuruBahan2(q.image2 || '');
                                      setGuruBahan3(q.image3 || '');
                                    }}
                                    className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-lg font-bold"
                                  >
                                    Edit
                                  </button>
                                  {confirmDeleteId === q.id ? (
                                    <div className="flex gap-1">
                                      <button 
                                        onClick={() => handleDeleteSoalan(q.id)}
                                        className="text-[10px] px-2 py-1 bg-red-600 text-white rounded-lg font-bold animate-pulse"
                                      >
                                        Sahkan?
                                      </button>
                                      <button 
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="text-[10px] px-2 py-1 bg-gray-200 text-gray-600 rounded-lg font-bold"
                                      >
                                        Batal
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => setConfirmDeleteId(q.id)}
                                      className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg font-bold"
                                    >
                                      Padam
                                    </button>
                                  )}
                                </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
               )}

               {activeGuruTab === 'penanda' && (
                 <div className="space-y-6">
                    <h3 className="text-xl font-bold">Penandaan Rumusan</h3>
                    <div className="flex gap-4">
                       <select 
                        value={penandaPelajar}
                        onChange={(e) => setPenandaPelajar(e.target.value)}
                        className="flex-1 p-3 border rounded-lg"
                       >
                         <option value="">Pilih Pelajar</option>
                         {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                       </select>
                       <select 
                        value={penandaSet}
                        onChange={(e) => setPenandaSet(e.target.value)}
                        className="flex-1 p-3 border rounded-lg"
                       >
                         <option value="">Pilih Set</option>
                         {Array.from({length: 30}, (_, i) => i+1).map(n => <option key={n} value={n}>Set {n}</option>)}
                       </select>
                       <button onClick={loadMarkingSession} className="px-6 py-3 bg-indigo-600 text-white rounded-lg">Muat Jawapan</button>
                    </div>
                    
                    {markingSession && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t">
                         <div className="bg-gray-50 p-6 rounded-xl">
                            <h4 className="font-bold mb-2">Jawapan Pelajar:</h4>
                            <div className="text-sm leading-relaxed p-4 bg-white rounded-lg border whitespace-pre-wrap">
                              {markingSession.content}
                            </div>
                         </div>
                         <div className="space-y-4">
                            <div className="grid grid-cols-4 gap-2">
                               {['p', 'a', 'b', 'c', 'd', 'e', 'k', 'bah'].map(key => (
                                 <div key={key}>
                                   <label className="text-[10px] uppercase font-bold text-gray-400 block text-center">{key}</label>
                                   <input 
                                    type="number" 
                                    value={(marksInput as any)[key]}
                                    onChange={(e) => setMarksInput({...marksInput, [key]: parseInt(e.target.value || '0')})}
                                    className="w-full p-2 border rounded text-center" 
                                   />
                                 </div>
                               ))}
                            </div>
                            <div className="bg-indigo-600 p-4 rounded-xl text-white text-center">
                               <p className="text-xs uppercase">Jumlah Keseluruhan</p>
                               <h2 className="text-3xl font-bold">
                                 {Math.min(((marksInput.p + marksInput.a + marksInput.b + marksInput.c + marksInput.d + marksInput.e + marksInput.k) * 2) + marksInput.bah, 30)} / 30
                               </h2>
                            </div>
                            <button onClick={handleSaveMarkah} className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl">Hantar Markah</button>
                         </div>
                      </div>
                    )}
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl text-white shadow-2xl transition-all duration-500 z-[100] ${toast.color}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
