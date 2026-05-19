import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock3,
  Edit3,
  ImagePlus,
  Download,
  HardDrive,
  Heart,
  Library,
  ListMusic,
  Music,
  Pause,
  Play,
  Repeat,
  Search,
  Settings,
  Shuffle,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Smartphone,
  Trash2,
  Upload,
  X,
  Volume2,
  Waves,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import heroArt from './assets/hero.png';
import './index.css';

const TRACKS_STORAGE_KEY = 'spotifyTracks';
const PLAYER_STORAGE_KEY = 'spotifyPlayerState';
const LANGUAGE_STORAGE_KEY = 'spotifyLanguage';
const PLAYLISTS_STORAGE_KEY = 'spotifyPlaylists';
const THEME_STORAGE_KEY = 'spotifyTheme';
const AUDIO_DB_NAME = 'spotify-pro-audio';
const AUDIO_DB_VERSION = 1;
const AUDIO_STORE_NAME = 'audio-files';
const LANGUAGES = ['ru', 'uk', 'en'];
const THEMES = ['green', 'dark', 'light', 'purple'];
const INSTALL_TEXT = {
  installApp: 'Install Maermok Studio',
  installedApp: 'Installed',
  installUnavailable: 'Open the browser menu and choose Install app or Add to Home Screen.',
};
const DEFAULT_PLAYLISTS = [
  { id: 'chill', name: 'Chill', trackIds: [] },
  { id: 'workout', name: 'Workout', trackIds: [] },
  { id: 'coding', name: 'Coding', trackIds: [] },
];

const UI_TEXT = {
  ru: {
    localStudio: 'Local Studio',
    searchPlaceholder: 'Поиск трека',
    allTracks: 'Медиатека',
    likedTracks: 'Любимые',
    libraryPanel: 'Библиотека',
    loading: 'Загрузка',
    addTracks: 'Добавить треки',
    export: 'Экспорт',
    import: 'Импорт',
    exported: 'Экспорт',
    autosave: 'Автосохранение',
    language: 'Язык',
    settings: 'Настройки',
    studioPlayback: 'Studio Playback',
    libraryReady: 'Медиатека готова',
    libraryReadyText: 'Добавьте локальные треки и продолжайте с сохраненными настройками.',
    tracks: 'треков',
    liked: 'любимых',
    total: 'всего',
    dropTitle: 'Перетащите аудио сюда',
    dropSubtitle: 'MP3, WAV, M4A и другие локальные файлы',
    favorites: 'Favorites',
    library: 'Library',
    playlist: 'Плейлист',
    favoriteTracks: 'Любимые треки',
    addFirstTrack: 'Добавьте первый трек',
    nothingFound: 'Ничего не найдено',
    addButtonHint: 'Кнопка добавления находится слева.',
    searchHint: 'Измените поиск или фильтр.',
    addToLiked: 'Добавить в любимые',
    removeTrack: 'Удалить трек',
    editTrack: 'Редактировать',
    playNext: 'Играть следующим',
    moveUp: 'Выше',
    moveDown: 'Ниже',
    noSelectedTrack: 'Нет выбранного трека',
    addMusicHint: 'Добавьте музыку в медиатеку',
    title: 'Название',
    artist: 'Артист',
    genre: 'Жанр',
    cover: 'Обложка',
    chooseCover: 'Выбрать обложку',
    save: 'Сохранить',
    cancel: 'Отмена',
    editDetails: 'Данные трека',
    playlistName: 'Название плейлиста',
    newPlaylist: 'Новый плейлист',
    playlists: 'Плейлисты',
    queue: 'Очередь',
    history: 'История',
    emptyQueue: 'Очередь пуста',
    emptyHistory: 'История пуста',
    addPlaylistPrompt: 'Как назвать плейлист?',
    themes: 'Темы',
    green: 'Green Glass',
    dark: 'Dark Neon',
    light: 'Light Minimal',
    purple: 'Purple Studio',
    artistFilter: 'Артист',
    genreFilter: 'Жанр',
    durationFilter: 'Длительность',
    sortBy: 'Сортировка',
    all: 'Все',
    short: 'Короткие',
    medium: 'Средние',
    long: 'Длинные',
    newest: 'Новые',
    titleSort: 'Название',
    artistSort: 'Артист',
    durationSort: 'Длительность',
    hotkeys: 'Space, ←/→, L, M',
    promptTrackName: (fileName) => `Как вы хотите назвать "${fileName}"?`,
    saveError: 'Не получилось сохранить музыку в браузере. Попробуйте файл поменьше или очистите место.',
    untitledTrack: 'Без названия',
    uploaded: 'Загружено',
    localLibrary: 'Local Library',
  },
  uk: {
    localStudio: 'Local Studio',
    searchPlaceholder: 'Пошук треку',
    allTracks: 'Медіатека',
    likedTracks: 'Улюблені',
    libraryPanel: 'Бібліотека',
    loading: 'Завантаження',
    addTracks: 'Додати треки',
    export: 'Експорт',
    import: 'Імпорт',
    exported: 'Експорт',
    autosave: 'Автозбереження',
    language: 'Мова',
    settings: 'Налаштування',
    studioPlayback: 'Studio Playback',
    libraryReady: 'Медіатека готова',
    libraryReadyText: 'Додайте локальні треки й продовжуйте зі збереженими налаштуваннями.',
    tracks: 'треків',
    liked: 'улюблених',
    total: 'усього',
    dropTitle: 'Перетягніть аудіо сюди',
    dropSubtitle: 'MP3, WAV, M4A та інші локальні файли',
    favorites: 'Favorites',
    library: 'Library',
    playlist: 'Плейлист',
    favoriteTracks: 'Улюблені треки',
    addFirstTrack: 'Додайте перший трек',
    nothingFound: 'Нічого не знайдено',
    addButtonHint: 'Кнопка додавання знаходиться ліворуч.',
    searchHint: 'Змініть пошук або фільтр.',
    addToLiked: 'Додати в улюблені',
    removeTrack: 'Видалити трек',
    editTrack: 'Редагувати',
    playNext: 'Грати наступним',
    moveUp: 'Вище',
    moveDown: 'Нижче',
    noSelectedTrack: 'Немає вибраного треку',
    addMusicHint: 'Додайте музику в медіатеку',
    title: 'Назва',
    artist: 'Артист',
    genre: 'Жанр',
    cover: 'Обкладинка',
    chooseCover: 'Вибрати обкладинку',
    save: 'Зберегти',
    cancel: 'Скасувати',
    editDetails: 'Дані треку',
    playlistName: 'Назва плейлиста',
    newPlaylist: 'Новий плейлист',
    playlists: 'Плейлисти',
    queue: 'Черга',
    history: 'Історія',
    emptyQueue: 'Черга порожня',
    emptyHistory: 'Історія порожня',
    addPlaylistPrompt: 'Як назвати плейлист?',
    themes: 'Теми',
    green: 'Green Glass',
    dark: 'Dark Neon',
    light: 'Light Minimal',
    purple: 'Purple Studio',
    artistFilter: 'Артист',
    genreFilter: 'Жанр',
    durationFilter: 'Тривалість',
    sortBy: 'Сортування',
    all: 'Усі',
    short: 'Короткі',
    medium: 'Середні',
    long: 'Довгі',
    newest: 'Нові',
    titleSort: 'Назва',
    artistSort: 'Артист',
    durationSort: 'Тривалість',
    hotkeys: 'Space, ←/→, L, M',
    promptTrackName: (fileName) => `Як ви хочете назвати "${fileName}"?`,
    saveError: 'Не вдалося зберегти музику в браузері. Спробуйте менший файл або очистьте місце.',
    untitledTrack: 'Без назви',
    uploaded: 'Завантажено',
    localLibrary: 'Local Library',
  },
  en: {
    localStudio: 'Local Studio',
    searchPlaceholder: 'Search tracks',
    allTracks: 'Library',
    likedTracks: 'Liked',
    libraryPanel: 'Library',
    loading: 'Loading',
    addTracks: 'Add tracks',
    export: 'Export',
    import: 'Import',
    exported: 'Export',
    autosave: 'Autosave',
    language: 'Language',
    settings: 'Settings',
    studioPlayback: 'Studio Playback',
    libraryReady: 'Library ready',
    libraryReadyText: 'Add local tracks and keep listening with saved settings.',
    tracks: 'tracks',
    liked: 'liked',
    total: 'total',
    dropTitle: 'Drop audio here',
    dropSubtitle: 'MP3, WAV, M4A and other local files',
    favorites: 'Favorites',
    library: 'Library',
    playlist: 'Playlist',
    favoriteTracks: 'Liked tracks',
    addFirstTrack: 'Add your first track',
    nothingFound: 'Nothing found',
    addButtonHint: 'The add button is on the left.',
    searchHint: 'Change the search or filter.',
    addToLiked: 'Add to liked',
    removeTrack: 'Remove track',
    editTrack: 'Edit',
    playNext: 'Play next',
    moveUp: 'Move up',
    moveDown: 'Move down',
    noSelectedTrack: 'No selected track',
    addMusicHint: 'Add music to your library',
    title: 'Title',
    artist: 'Artist',
    genre: 'Genre',
    cover: 'Cover',
    chooseCover: 'Choose cover',
    save: 'Save',
    cancel: 'Cancel',
    editDetails: 'Track details',
    playlistName: 'Playlist name',
    newPlaylist: 'New playlist',
    playlists: 'Playlists',
    queue: 'Queue',
    history: 'History',
    emptyQueue: 'Queue is empty',
    emptyHistory: 'History is empty',
    addPlaylistPrompt: 'What should the playlist be called?',
    themes: 'Themes',
    green: 'Green Glass',
    dark: 'Dark Neon',
    light: 'Light Minimal',
    purple: 'Purple Studio',
    artistFilter: 'Artist',
    genreFilter: 'Genre',
    durationFilter: 'Duration',
    sortBy: 'Sort by',
    all: 'All',
    short: 'Short',
    medium: 'Medium',
    long: 'Long',
    newest: 'Newest',
    titleSort: 'Title',
    artistSort: 'Artist',
    durationSort: 'Duration',
    hotkeys: 'Space, ←/→, L, M',
    promptTrackName: (fileName) => `What do you want to name "${fileName}"?`,
    saveError: 'Could not save music in the browser. Try a smaller file or free up space.',
    untitledTrack: 'Untitled track',
    uploaded: 'Uploaded',
    localLibrary: 'Local Library',
  },
};

const getInitialLanguage = () => {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (LANGUAGES.includes(saved)) return saved;

  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith('uk')) return 'uk';
  if (browserLanguage.startsWith('en')) return 'en';
  return 'ru';
};

const readStoredJson = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};

const openAudioDb = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(AUDIO_DB_NAME, AUDIO_DB_VERSION);

  request.onupgradeneeded = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(AUDIO_STORE_NAME)) {
      db.createObjectStore(AUDIO_STORE_NAME);
    }
  };

  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const withAudioStore = async (mode, action) => {
  const db = await openAudioDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(AUDIO_STORE_NAME, mode);
    const store = transaction.objectStore(AUDIO_STORE_NAME);
    const request = action(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

const saveAudioBlob = (id, blob) => withAudioStore('readwrite', store => store.put(blob, id));
const readAudioBlob = (id) => withAudioStore('readonly', store => store.get(id));
const deleteAudioBlob = (id) => withAudioStore('readwrite', store => store.delete(id));
const clearAudioBlobs = () => withAudioStore('readwrite', store => store.clear());

const dataUrlToBlob = async (url) => {
  const response = await fetch(url);
  return response.blob();
};

const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(blob);
});

const getDefaultTrackTitle = (fileName) => fileName.replace(/\.[^/.]+$/, '') || 'Untitled track';

const getTrackHue = (value = '') => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

const normalizeTrack = (track, index = 0) => ({
  id: track?.id ?? `${Date.now()}-${index}`,
  title: typeof track?.title === 'string' && track.title.trim() ? track.title : 'Untitled track',
  artist: typeof track?.artist === 'string' && track.artist.trim() ? track.artist : 'Uploaded',
  genre: typeof track?.genre === 'string' ? track.genre : '',
  cover: typeof track?.cover === 'string' ? track.cover : '',
  addedAt: Number.isFinite(track?.addedAt) ? track.addedAt : Date.now(),
  duration: Number.isFinite(track?.duration) ? track.duration : 0,
  liked: Boolean(track?.liked),
  fileName: typeof track?.fileName === 'string' ? track.fileName : '',
  mimeType: typeof track?.mimeType === 'string' ? track.mimeType : '',
  size: Number.isFinite(track?.size) ? track.size : 0,
  url: typeof track?.url === 'string' ? track.url : '',
});

const loadTracks = () => {
  const stored = readStoredJson(TRACKS_STORAGE_KEY, []);
  return Array.isArray(stored) ? stored.map(normalizeTrack) : [];
};

const normalizePlaylists = (playlists) => (
  Array.isArray(playlists) && playlists.length > 0
    ? playlists.map((playlist, index) => ({
      id: playlist?.id ?? `playlist-${index}`,
      name: typeof playlist?.name === 'string' && playlist.name.trim() ? playlist.name : `Playlist ${index + 1}`,
      trackIds: Array.isArray(playlist?.trackIds) ? playlist.trackIds : [],
    }))
    : DEFAULT_PLAYLISTS
);

const loadPlaylists = () => normalizePlaylists(readStoredJson(PLAYLISTS_STORAGE_KEY, DEFAULT_PLAYLISTS));

const serializeTrack = (track) => {
  const serialized = { ...track };
  delete serialized.url;
  return serialized;
};

const loadPlayerState = () => {
  const stored = readStoredJson(PLAYER_STORAGE_KEY, {});
  return {
    currentTrackId: stored?.currentTrackId ?? null,
    currentTime: Number.isFinite(Number(stored?.currentTime)) ? Number(stored.currentTime) : 0,
    volume: Number.isFinite(Number(stored?.volume)) ? Number(stored.volume) : 86,
    isShuffle: Boolean(stored?.isShuffle),
    repeatMode: [0, 1, 2].includes(stored?.repeatMode) ? stored.repeatMode : 0,
    queueIds: Array.isArray(stored?.queueIds) ? stored.queueIds : [],
    historyIds: Array.isArray(stored?.historyIds) ? stored.historyIds : [],
  };
};

const getInitialTheme = () => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return THEMES.includes(saved) ? saved : 'green';
};

const formatTime = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const normalizeSearchText = (value = '') => value
  .toString()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ё/g, 'е')
  .replace(/і/g, 'и')
  .replace(/ї/g, 'и')
  .replace(/є/g, 'е')
  .toLowerCase()
  .trim();

const getTrackSearchText = (track) => normalizeSearchText([
  track.title,
  track.artist,
  track.genre,
  track.fileName,
].filter(Boolean).join(' '));

function App() {
  const [tracks, setTracks] = useState(loadTracks);
  const [playlists, setPlaylists] = useState(loadPlaylists);
  const [currentTrackId, setCurrentTrackId] = useState(() => loadPlayerState().currentTrackId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => loadPlayerState().currentTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => loadPlayerState().volume);
  const [previousVolume, setPreviousVolume] = useState(() => loadPlayerState().volume || 86);
  const [isShuffle, setIsShuffle] = useState(() => loadPlayerState().isShuffle);
  const [repeatMode, setRepeatMode] = useState(() => loadPlayerState().repeatMode);
  const [queueIds, setQueueIds] = useState(() => loadPlayerState().queueIds);
  const [historyIds, setHistoryIds] = useState(() => loadPlayerState().historyIds);
  const [dragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [artistFilter, setArtistFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [sortMode, setSortMode] = useState('newest');
  const [editingTrackId, setEditingTrackId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', artist: '', genre: '', cover: '', playlistId: '' });
  const [lastExportedAt, setLastExportedAt] = useState(null);
  const [language, setLanguage] = useState(getInitialLanguage);
  const [theme, setTheme] = useState(getInitialTheme);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(() => (
    window.matchMedia('(display-mode: standalone)').matches || Boolean(navigator.standalone)
  ));
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const resumeTrackIdRef = useRef(loadPlayerState().currentTrackId);
  const resumeTimeRef = useRef(loadPlayerState().currentTime);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  const resumeAppliedRef = useRef(false);
  const fileInputRef = useRef(null);
  const importInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const objectUrlsRef = useRef(new Map());
  const initialTracksRef = useRef(tracks);

  const resolvedTrackIndex = tracks.findIndex(track => track.id === currentTrackId);
  const currentTrackIndex = tracks.length === 0 ? -1 : Math.max(0, resolvedTrackIndex);
  const currentTrack = currentTrackIndex >= 0 ? tracks[currentTrackIndex] : null;
  const currentTrackUrl = currentTrack?.url;
  const likedTracks = tracks.filter(track => track.liked);
  const activePlaylistId = activeView.startsWith('playlist:') ? activeView.replace('playlist:', '') : null;
  const activePlaylist = playlists.find(playlist => playlist.id === activePlaylistId);
  const totalDuration = tracks.reduce((sum, track) => sum + (track.duration || 0), 0);
  const availableArtists = [...new Set(tracks.map(track => track.artist).filter(Boolean))].sort();
  const availableGenres = [...new Set(tracks.map(track => track.genre).filter(Boolean))].sort();
  const queueTracks = queueIds.map(id => tracks.find(track => track.id === id)).filter(Boolean);
  const historyTracks = historyIds.map(id => tracks.find(track => track.id === id)).filter(Boolean);
  const searchTokens = normalizeSearchText(searchQuery).split(/\s+/).filter(Boolean);
  const hasSearchQuery = searchTokens.length > 0;
  const filteredTracks = tracks.filter((track) => {
    const matchesView = hasSearchQuery
      ? true
      : activePlaylist
      ? activePlaylist.trackIds.includes(track.id)
      : activeView === 'liked'
        ? track.liked
        : true;
    const haystack = getTrackSearchText(track);
    const matchesDuration = durationFilter === 'all'
      || (durationFilter === 'short' && track.duration > 0 && track.duration < 180)
      || (durationFilter === 'medium' && track.duration >= 180 && track.duration <= 300)
      || (durationFilter === 'long' && track.duration > 300);
    return matchesView
      && searchTokens.every(token => haystack.includes(token))
      && (artistFilter === 'all' || track.artist === artistFilter)
      && (genreFilter === 'all' || track.genre === genreFilter)
      && matchesDuration;
  }).sort((a, b) => {
    if (sortMode === 'title') return a.title.localeCompare(b.title);
    if (sortMode === 'artist') return a.artist.localeCompare(b.artist);
    if (sortMode === 'duration') return (b.duration || 0) - (a.duration || 0);
    return (b.addedAt || 0) - (a.addedAt || 0);
  });
  const t = UI_TEXT[language];
  const storageLabel = lastExportedAt ? `${t.exported} ${lastExportedAt}` : t.autosave;
  const editingTrack = tracks.find(track => track.id === editingTrackId);

  const selectTrack = useCallback((index, options = {}) => {
    if (!tracks[index]) return;
    if (options.addToHistory !== false && currentTrack?.id && currentTrack.id !== tracks[index].id) {
      setHistoryIds(prev => [currentTrack.id, ...prev.filter(id => id !== currentTrack.id)].slice(0, 12));
    }
    resumeAppliedRef.current = options.resume !== true;
    setCurrentTime(0);
    setDuration(tracks[index].duration || 0);
    setCurrentTrackId(tracks[index].id);
    setIsPlaying(true);
  }, [currentTrack, tracks]);

  const playNext = useCallback(() => {
    if (tracks.length === 0) return;

    if (queueIds.length > 0) {
      const [nextId, ...rest] = queueIds;
      const queuedIndex = tracks.findIndex(track => track.id === nextId);
      setQueueIds(rest);
      if (queuedIndex !== -1) {
        selectTrack(queuedIndex);
        return;
      }
    }

    let nextIndex = currentTrackIndex + 1;
    if (isShuffle && tracks.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (nextIndex === currentTrackIndex);
    }

    const resolvedIndex = repeatMode === 1 ? nextIndex % tracks.length : Math.min(nextIndex, tracks.length - 1);
    if (repeatMode === 0 && currentTrackIndex === tracks.length - 1) {
      setIsPlaying(false);
      return;
    }

    selectTrack(resolvedIndex);
  }, [currentTrackIndex, isShuffle, queueIds, repeatMode, selectTrack, tracks]);

  useEffect(() => {
    try {
      localStorage.setItem(TRACKS_STORAGE_KEY, JSON.stringify(tracks.map(serializeTrack)));
    } catch (err) {
      console.warn('Unable to save tracks:', err);
    }
  }, [tracks]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const standaloneQuery = window.matchMedia('(display-mode: standalone)');
    const updateInstalledState = () => {
      setIsAppInstalled(standaloneQuery.matches || Boolean(navigator.standalone));
    };
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setIsAppInstalled(false);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setIsAppInstalled(true);
    };

    updateInstalledState();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    if (standaloneQuery.addEventListener) {
      standaloneQuery.addEventListener('change', updateInstalledState);
    } else {
      standaloneQuery.addListener(updateInstalledState);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      if (standaloneQuery.removeEventListener) {
        standaloneQuery.removeEventListener('change', updateInstalledState);
      } else {
        standaloneQuery.removeListener(updateInstalledState);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const objectUrls = objectUrlsRef.current;

    const hydrateAudio = async () => {
      const hydratedTracks = await Promise.all(initialTracksRef.current.map(async (track) => {
        try {
          if (track.url?.startsWith('data:')) {
            const blob = await dataUrlToBlob(track.url);
            await saveAudioBlob(track.id, blob);
            const objectUrl = URL.createObjectURL(blob);
            objectUrls.set(track.id, objectUrl);
            return { ...track, url: objectUrl, mimeType: blob.type, size: blob.size };
          }

          if (track.url?.startsWith('blob:')) return track;

          const blob = await readAudioBlob(track.id);
          if (!blob) return track;

          const objectUrl = URL.createObjectURL(blob);
          objectUrls.set(track.id, objectUrl);
          return { ...track, url: objectUrl, mimeType: track.mimeType || blob.type, size: track.size || blob.size };
        } catch (err) {
          console.warn('Unable to restore audio file:', err);
          return track;
        }
      }));

      if (!cancelled) setTracks(hydratedTracks);
    };

    hydrateAudio();

    return () => {
      cancelled = true;
      objectUrls.forEach(url => URL.revokeObjectURL(url));
      objectUrls.clear();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify({
        currentTrackId: currentTrack?.id ?? null,
        currentTime,
        volume,
        isShuffle,
        repeatMode,
        queueIds,
        historyIds,
      }));
    } catch (err) {
      console.warn('Unable to save player settings:', err);
    }
  }, [currentTime, currentTrack?.id, historyIds, isShuffle, queueIds, repeatMode, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      const nextDuration = audio.duration || 0;
      setDuration(nextDuration);
      if (!resumeAppliedRef.current && currentTrack?.id === resumeTrackIdRef.current && resumeTimeRef.current > 0) {
        audio.currentTime = Math.min(resumeTimeRef.current, Math.max(nextDuration - 1, 0));
        setCurrentTime(audio.currentTime);
        resumeAppliedRef.current = true;
      }
      if (!currentTrack?.id || !Number.isFinite(nextDuration)) return;
      setTracks(prev => prev.map(track => (
        track.id === currentTrack.id ? { ...track, duration: nextDuration } : track
      )));
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentTrack?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 2) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      playNext();
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [playNext, repeatMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrackUrl) {
      audio.src = currentTrackUrl;
      return;
    }

    audio.pause();
    audio.removeAttribute('src');
  }, [currentTrackUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && currentTrackUrl) {
      audio.play().catch(err => console.log('Play error:', err));
      return;
    }

    audio.pause();
  }, [currentTrackUrl, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return undefined;

    const canvasContext = canvas.getContext('2d');
    const drawIdle = () => {
      const { width, height } = canvas;
      canvasContext.clearRect(0, 0, width, height);
      canvasContext.fillStyle = 'rgba(134, 239, 172, 0.24)';
      for (let i = 0; i < 42; i += 1) {
        const barHeight = 8 + (i % 9) * 4;
        canvasContext.fillRect(i * (width / 42), height - barHeight, 4, barHeight);
      }
    };

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
    };

    resizeCanvas();

    const draw = () => {
      const analyser = analyserRef.current;
      if (!analyser) {
        drawIdle();
        return;
      }

      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);

      const bars = 48;
      const step = Math.floor(data.length / bars);
      const barWidth = canvas.width / bars - 3;
      for (let i = 0; i < bars; i += 1) {
        const value = data[i * step] / 255;
        const barHeight = Math.max(5, value * canvas.height);
        const hue = theme === 'purple' ? 274 : theme === 'dark' ? 144 : theme === 'light' ? 118 : 132;
        const gradient = canvasContext.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, `hsla(${hue}, 90%, 78%, 0.95)`);
        gradient.addColorStop(1, `hsla(${hue + 28}, 84%, 46%, 0.32)`);
        canvasContext.fillStyle = gradient;
        canvasContext.fillRect(i * (barWidth + 3), canvas.height - barHeight, barWidth, barHeight);
      }
      animationRef.current = requestAnimationFrame(draw);
    };

    const setupAudioGraph = async () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 128;
      }

      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }

      if (isPlaying) {
        await audioContextRef.current.resume();
        animationRef.current = requestAnimationFrame(draw);
      } else {
        drawIdle();
      }
    };

    setupAudioGraph().catch(() => drawIdle());
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [currentTrackUrl, isPlaying, theme]);

  const playPrev = useCallback(() => {
    if (tracks.length === 0) return;
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    selectTrack(prevIndex);
  }, [currentTime, currentTrackIndex, selectTrack, tracks.length]);

  const togglePlay = useCallback(() => {
    if (!currentTrack && tracks[0]) {
      selectTrack(0);
      return;
    }
    setIsPlaying(prev => !prev);
  }, [currentTrack, selectTrack, tracks]);

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const clampedPercent = Math.min(Math.max(percent, 0), 1);
    const newTime = clampedPercent * (duration || 0);
    if (audioRef.current) audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleLike = useCallback((id) => {
    setTracks(prev => prev.map(track => (
      track.id === id ? { ...track, liked: !track.liked } : track
    )));
  }, []);

  const toggleMute = useCallback(() => {
    setVolume((value) => {
      if (value === 0) return previousVolume || 86;
      setPreviousVolume(value);
      return 0;
    });
  }, [previousVolume]);

  const openTrackEditor = (track) => {
    setEditingTrackId(track.id);
    setEditForm({
      title: track.title,
      artist: track.artist,
      genre: track.genre || '',
      cover: track.cover || '',
      playlistId: playlists.find(playlist => playlist.trackIds.includes(track.id))?.id || '',
    });
  };

  const handleCoverInput = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      setEditForm(prev => ({ ...prev, cover: readerEvent.target.result }));
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const saveTrackEdit = () => {
    if (!editingTrack) return;

    setTracks(prev => prev.map(track => (
      track.id === editingTrack.id
        ? {
          ...track,
          title: editForm.title.trim() || track.title,
          artist: editForm.artist.trim() || track.artist,
          genre: editForm.genre.trim(),
          cover: editForm.cover,
        }
        : track
    )));

    setPlaylists(prev => prev.map(playlist => {
      const withoutTrack = playlist.trackIds.filter(id => id !== editingTrack.id);
      return playlist.id === editForm.playlistId
        ? { ...playlist, trackIds: [...withoutTrack, editingTrack.id] }
        : { ...playlist, trackIds: withoutTrack };
    }));

    setEditingTrackId(null);
  };

  const addPlaylist = () => {
    const name = window.prompt(t.addPlaylistPrompt, t.newPlaylist);
    if (!name?.trim()) return;

    setPlaylists(prev => [
      ...prev,
      { id: `playlist-${Date.now()}-${crypto.randomUUID()}`, name: name.trim(), trackIds: [] },
    ]);
  };

  const addToQueue = (id) => {
    setQueueIds(prev => [...prev, id]);
  };

  const moveQueuedTrack = (index, direction) => {
    setQueueIds(prev => {
      const next = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const reorderTrack = (draggedId, targetId) => {
    if (!draggedId || draggedId === targetId) return;
    setTracks(prev => {
      const next = [...prev];
      const from = next.findIndex(track => track.id === draggedId);
      const to = next.findIndex(track => track.id === targetId);
      if (from === -1 || to === -1) return prev;
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
      if (isTyping || editingTrackId) return;

      if (event.code === 'Space') {
        event.preventDefault();
        togglePlay();
      }
      if (event.code === 'ArrowRight') playNext();
      if (event.code === 'ArrowLeft') playPrev();
      if (event.key.toLowerCase() === 'l' && currentTrack?.id) toggleLike(currentTrack.id);
      if (event.key.toLowerCase() === 'm') toggleMute();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTrack?.id, editingTrackId, playNext, playPrev, toggleLike, toggleMute, togglePlay]);

  const deleteTrack = (id) => {
    const deletedIndex = tracks.findIndex(track => track.id === id);
    if (deletedIndex === -1) return;
    const objectUrl = objectUrlsRef.current.get(id);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrlsRef.current.delete(id);
    }
    deleteAudioBlob(id).catch(err => console.warn('Unable to delete audio file:', err));

    const nextTracks = tracks.filter(track => track.id !== id);
    setTracks(nextTracks);

    if (nextTracks.length === 0) {
      setCurrentTrackId(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    if (currentTrack?.id === id) {
      const nextIndex = Math.min(deletedIndex, nextTracks.length - 1);
      setCurrentTrackId(nextTracks[nextIndex].id);
      setCurrentTime(0);
      setDuration(nextTracks[nextIndex].duration || 0);
    }
  };

  const processAudioFiles = async (files) => {
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    if (audioFiles.length === 0) return;

    setIsLoading(true);

    try {
      const nextTracks = [];

      for (const file of audioFiles) {
        const defaultTitle = getDefaultTrackTitle(file.name);
        const requestedTitle = window.prompt(t.promptTrackName(file.name), defaultTitle);
        if (requestedTitle === null) continue;

        const id = `${Date.now()}-${crypto.randomUUID()}`;
        await saveAudioBlob(id, file);

        const objectUrl = URL.createObjectURL(file);
        objectUrlsRef.current.set(id, objectUrl);
        nextTracks.push({
          id,
          title: requestedTitle.trim() || defaultTitle,
          artist: t.localLibrary,
          genre: '',
          cover: '',
          addedAt: Date.now(),
          duration: 0,
          liked: false,
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
          url: objectUrl,
        });
      }

      if (nextTracks.length > 0) {
        setTracks(prev => [...prev, ...nextTracks]);
        setCurrentTrackId(prev => prev ?? nextTracks[0].id);
      }
    } catch (err) {
      console.warn('Unable to save audio files:', err);
      window.alert(t.saveError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processAudioFiles(Array.from(e.dataTransfer.files || []));
  };

  const handleFileInput = (e) => {
    processAudioFiles(Array.from(e.target.files || []));
    e.target.value = '';
  };

  const exportLibrary = async () => {
    const portableTracks = await Promise.all(tracks.map(async (track) => {
      try {
        const blob = await readAudioBlob(track.id);
        if (!blob) return serializeTrack(track);
        return { ...serializeTrack(track), url: await blobToDataUrl(blob) };
      } catch {
        return serializeTrack(track);
      }
    }));

    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      tracks: portableTracks,
      playlists,
      player: {
        currentTrackId: currentTrack?.id ?? null,
        currentTime,
        volume,
        isShuffle,
        repeatMode,
        queueIds,
        historyIds,
      },
      theme,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `maermok-studio-library-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setLastExportedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const importLibrary = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const incomingTracks = Array.isArray(parsed) ? parsed : parsed?.tracks;
        const importedTracks = Array.isArray(incomingTracks) ? incomingTracks.map(normalizeTrack) : [];
        const nextTracks = [];

        objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
        objectUrlsRef.current.clear();
        await clearAudioBlobs();

        for (const track of importedTracks) {
          if (!track.url?.startsWith('data:')) continue;

          const blob = await dataUrlToBlob(track.url);
          await saveAudioBlob(track.id, blob);
          const objectUrl = URL.createObjectURL(blob);
          objectUrlsRef.current.set(track.id, objectUrl);
          nextTracks.push({
            ...serializeTrack(track),
            mimeType: track.mimeType || blob.type,
            size: track.size || blob.size,
            url: objectUrl,
          });
        }

        if (nextTracks.length === 0) return;

        setTracks(nextTracks);
        setPlaylists(normalizePlaylists(parsed?.playlists));
        setCurrentTrackId(parsed?.player?.currentTrackId ?? nextTracks[0].id);
        setCurrentTime(Number.isFinite(Number(parsed?.player?.currentTime)) ? Number(parsed.player.currentTime) : 0);
        if (Number.isFinite(Number(parsed?.player?.volume))) setVolume(Number(parsed.player.volume));
        setIsShuffle(Boolean(parsed?.player?.isShuffle));
        if ([0, 1, 2].includes(parsed?.player?.repeatMode)) setRepeatMode(parsed.player.repeatMode);
        setQueueIds(Array.isArray(parsed?.player?.queueIds) ? parsed.player.queueIds : []);
        setHistoryIds(Array.isArray(parsed?.player?.historyIds) ? parsed.player.historyIds : []);
        if (THEMES.includes(parsed?.theme)) setTheme(parsed.theme);
        setIsPlaying(false);
        setDuration(0);
      } catch (err) {
        console.warn('Unable to import library:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const installApp = async () => {
    if (isAppInstalled) return;
    if (!installPrompt) {
      window.alert(INSTALL_TEXT.installUnavailable);
      return;
    }

    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result?.outcome === 'accepted') {
      setIsAppInstalled(true);
    }
    setInstallPrompt(null);
  };

  return (
    <div className={`app-shell theme-${theme} h-screen w-screen overflow-hidden text-white`}>
      <audio ref={audioRef} crossOrigin="anonymous" />
      <div className="ambient-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <aside className="sidebar-shell">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Music size={24} />
          </div>
          <div className="brand-copy">
            <p className="text-sm font-semibold text-white">Maermok Studio</p>
            <p className="text-xs text-slate-400">{t.localStudio}</p>
          </div>
          <button
            type="button"
            className={`settings-toggle ${settingsOpen ? 'settings-toggle-active' : ''}`}
            onClick={() => setSettingsOpen(prev => !prev)}
            aria-label={t.settings}
            aria-expanded={settingsOpen}
          >
            <Settings size={18} />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {settingsOpen && (
            <motion.div
              className="settings-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="settings-panel-inner">
                <button
                  type="button"
                  onClick={installApp}
                  disabled={isAppInstalled}
                  className="install-action"
                >
                  <Smartphone size={17} />
                  <span>{isAppInstalled ? INSTALL_TEXT.installedApp : INSTALL_TEXT.installApp}</span>
                </button>

                <div className="settings-group">
                  <p className="panel-label">{t.language}</p>
                  <div className="language-switcher" aria-label={t.language}>
                    {LANGUAGES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setLanguage(item)}
                        className={language === item ? 'language-active' : ''}
                      >
                        {item.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-group">
                  <p className="panel-label">{t.themes}</p>
                  <div className="theme-switcher">
                    {THEMES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setTheme(item)}
                        className={theme === item ? 'theme-active' : ''}
                      >
                        {t[item]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-actions">
                  <button onClick={exportLibrary} disabled={tracks.length === 0} className="secondary-action">
                    <Download size={16} />
                    <span>{t.export}</span>
                  </button>
                  <button onClick={() => importInputRef.current?.click()} className="secondary-action">
                    <Upload size={16} />
                    <span>{t.import}</span>
                  </button>
                </div>
                <input
                  ref={importInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={importLibrary}
                  className="hidden"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="search-field">
          <Search size={17} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label={t.cancel}
              className="search-clear"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveView('all')}
            className={`nav-item ${activeView === 'all' ? 'nav-item-active' : ''}`}
          >
            <Library size={18} />
            <span>{t.allTracks}</span>
            <strong>{tracks.length}</strong>
          </button>
          <button
            onClick={() => setActiveView('liked')}
            className={`nav-item ${activeView === 'liked' ? 'nav-item-active' : ''}`}
          >
            <Heart size={18} />
            <span>{t.likedTracks}</span>
            <strong>{likedTracks.length}</strong>
          </button>
        </nav>

        <div className="sidebar-section">
          <div className="sidebar-section-head">
            <span>{t.playlists}</span>
            <button type="button" onClick={addPlaylist} aria-label={t.newPlaylist}>+</button>
          </div>
          <div className="playlist-nav">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                type="button"
                onClick={() => setActiveView(`playlist:${playlist.id}`)}
                className={activeView === `playlist:${playlist.id}` ? 'playlist-nav-active' : ''}
              >
                <span>{playlist.name}</span>
                <strong>{playlist.trackIds.length}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-panel">
          <p className="panel-label">{t.libraryPanel}</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="primary-action"
          >
            {isLoading ? <Waves size={18} className="animate-spin" /> : <Upload size={18} />}
            <span>{isLoading ? t.loading : t.addTracks}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={isLoading}
          />
        </div>

        <div className="storage-status">
          <CheckCircle2 size={17} />
          <span>{storageLabel}</span>
        </div>
      </aside>

      <main className="main-shell">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">{t.studioPlayback}</p>
            <h1>{currentTrack ? currentTrack.title : t.libraryReady}</h1>
            <p>{currentTrack ? currentTrack.artist : t.libraryReadyText}</p>
            <div className={`hero-equalizer ${isPlaying ? 'is-playing' : ''}`} aria-hidden="true">
              {Array.from({ length: 18 }).map((_, index) => (
                <span key={index} style={{ '--bar': index, '--eq-height': `${10 + (index % 7) * 5}px` }} />
              ))}
            </div>
            <div className="metric-row">
              <div className="metric-tile">
                <ListMusic size={18} />
                <span>{tracks.length}</span>
                <small>{t.tracks}</small>
              </div>
              <div className="metric-tile">
                <Heart size={18} />
                <span>{likedTracks.length}</span>
                <small>{t.liked}</small>
              </div>
              <div className="metric-tile">
                <Clock3 size={18} />
                <span>{formatTime(totalDuration)}</span>
                <small>{t.total}</small>
              </div>
            </div>
          </div>
          <div className="now-card">
            <img src={heroArt} alt="" className="hero-art" />
            <div
              className="cover-plate"
              style={{
                '--cover-hue': getTrackHue(currentTrack?.id || currentTrack?.title || 'spotify'),
                backgroundImage: currentTrack?.cover ? `url(${currentTrack.cover})` : undefined,
              }}
            >
              <div className="cover-scanline" aria-hidden="true" />
              {!currentTrack?.cover && (
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 9, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                  className="cover-disc"
                >
                  <Music size={56} />
                </motion.div>
              )}
            </div>
            <canvas ref={canvasRef} className="audio-visualizer" aria-hidden="true" />
          </div>
        </section>

        <section className="content-grid">
          <div className="side-panel-stack">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`drop-panel ${dragOver ? 'drop-panel-active' : ''}`}
            >
              <HardDrive size={22} />
              <div>
                <p>{t.dropTitle}</p>
                <span>{t.dropSubtitle}</span>
              </div>
            </div>

            <div className="queue-panel">
              <div className="mini-section-heading">
                <span>{t.queue}</span>
                <small>{queueTracks.length}</small>
              </div>
              {queueTracks.length === 0 ? (
                <p className="muted-line">{t.emptyQueue}</p>
              ) : queueTracks.slice(0, 5).map((track, index) => (
                <div key={`${track.id}-${index}`} className="compact-track">
                  <span>{track.title}</span>
                  <div>
                    <button type="button" onClick={() => moveQueuedTrack(index, -1)} aria-label={t.moveUp}>↑</button>
                    <button type="button" onClick={() => moveQueuedTrack(index, 1)} aria-label={t.moveDown}>↓</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="queue-panel">
              <div className="mini-section-heading">
                <span>{t.history}</span>
                <small>{historyTracks.length}</small>
              </div>
              {historyTracks.length === 0 ? (
                <p className="muted-line">{t.emptyHistory}</p>
              ) : historyTracks.slice(0, 5).map((track) => (
                <button
                  key={track.id}
                  type="button"
                  className="history-track"
                  onClick={() => selectTrack(tracks.findIndex(item => item.id === track.id), { addToHistory: false })}
                >
                  {track.title}
                </button>
              ))}
            </div>
          </div>

          <div className="playlist-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{activeView === 'liked' ? t.favorites : t.library}</p>
                <h2>{activePlaylist?.name || (activeView === 'liked' ? t.favoriteTracks : t.playlist)}</h2>
              </div>
              <Activity size={20} />
            </div>

            <div className="filter-bar">
              <label>
                <SlidersHorizontal size={15} />
                <select value={artistFilter} onChange={(e) => setArtistFilter(e.target.value)}>
                  <option value="all">{t.artistFilter}: {t.all}</option>
                  {availableArtists.map(artist => <option key={artist} value={artist}>{artist}</option>)}
                </select>
              </label>
              <label>
                <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                  <option value="all">{t.genreFilter}: {t.all}</option>
                  {availableGenres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
                </select>
              </label>
              <label>
                <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)}>
                  <option value="all">{t.durationFilter}: {t.all}</option>
                  <option value="short">{t.short}</option>
                  <option value="medium">{t.medium}</option>
                  <option value="long">{t.long}</option>
                </select>
              </label>
              <label>
                <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
                  <option value="newest">{t.sortBy}: {t.newest}</option>
                  <option value="title">{t.titleSort}</option>
                  <option value="artist">{t.artistSort}</option>
                  <option value="duration">{t.durationSort}</option>
                </select>
              </label>
            </div>

            {filteredTracks.length === 0 ? (
              <div className="empty-state">
                <Music size={48} />
                <p>{tracks.length === 0 ? t.addFirstTrack : t.nothingFound}</p>
                <span>{tracks.length === 0 ? t.addButtonHint : t.searchHint}</span>
              </div>
            ) : (
              <div className="track-list">
                <AnimatePresence initial={false}>
                  {filteredTracks.map((track) => {
                    const originalIndex = tracks.findIndex(item => item.id === track.id);
                    const isCurrent = track.id === currentTrack?.id;

                    return (
                      <motion.div
                        key={track.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', track.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          reorderTrack(e.dataTransfer.getData('text/plain'), track.id);
                        }}
                        onClick={() => selectTrack(originalIndex)}
                        className={`track-row ${isCurrent ? 'track-row-active' : ''}`}
                      >
                        <div
                          className="track-cover"
                          style={{
                            '--cover-hue': getTrackHue(track.id),
                            backgroundImage: track.cover ? `url(${track.cover})` : undefined,
                          }}
                        >
                          {isCurrent && isPlaying ? <Waves size={18} /> : !track.cover && <span>{originalIndex + 1}</span>}
                        </div>
                        <div className="track-copy">
                          <p>{track.title}</p>
                          <span>{track.artist}{track.genre ? ` · ${track.genre}` : ''}</span>
                        </div>
                        <span className="track-duration">
                          {formatTime(isCurrent ? duration || track.duration : track.duration)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToQueue(track.id);
                          }}
                          className="icon-button"
                          aria-label={t.playNext}
                        >
                          <SkipForward size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openTrackEditor(track);
                          }}
                          className="icon-button"
                          aria-label={t.editTrack}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(track.id);
                          }}
                          className={`icon-button ${track.liked ? 'icon-button-liked' : ''}`}
                          aria-label={t.addToLiked}
                        >
                          <Heart size={17} fill={track.liked ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTrack(track.id);
                          }}
                          className="icon-button danger-button"
                          aria-label={t.removeTrack}
                        >
                          <Trash2 size={17} />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="player-shell">
        <div className="player-track">
          <div
            className="mini-cover"
            style={{
              '--cover-hue': getTrackHue(currentTrack?.id || 'mini'),
              backgroundImage: currentTrack?.cover ? `url(${currentTrack.cover})` : undefined,
            }}
          >
            {!currentTrack?.cover && <Music size={20} />}
            <span className={`mini-eq ${isPlaying ? 'is-playing' : ''}`} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </div>
          <div>
            <p>{currentTrack?.title ?? t.noSelectedTrack}</p>
            <span>{currentTrack?.artist ?? t.addMusicHint}</span>
          </div>
        </div>

        <div className="player-center">
          <div className="control-row">
            <button
              onClick={() => setIsShuffle(prev => !prev)}
              className={`icon-button ${isShuffle ? 'icon-button-active' : ''}`}
              aria-label="Shuffle"
            >
              <Shuffle size={19} />
            </button>
            <button onClick={playPrev} className="icon-button" aria-label="Previous">
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              disabled={tracks.length === 0}
              className="play-button"
              aria-label="Play"
            >
              {isPlaying ? <Pause size={26} /> : <Play size={26} />}
            </button>
            <button onClick={playNext} className="icon-button" aria-label="Next">
              <SkipForward size={20} />
            </button>
            <button
              onClick={() => setRepeatMode(prev => (prev + 1) % 3)}
              className={`icon-button repeat-button ${repeatMode > 0 ? 'icon-button-active' : ''}`}
              aria-label="Repeat"
            >
              <Repeat size={19} />
              {repeatMode === 2 && <span>1</span>}
            </button>
          </div>
          <div className="progress-wrap">
            <span>{formatTime(currentTime)}</span>
            <div onClick={handleSeek} className="progress-bar">
              <div className={`waveform ${isPlaying ? 'is-playing' : ''}`} aria-hidden="true">
                {Array.from({ length: 36 }).map((_, index) => (
                  <i key={index} style={{ '--wave': index, '--wave-height': `${7 + (index % 9) * 2}px` }} />
                ))}
              </div>
              <div
                className="progress-fill"
                style={{ width: duration ? `${Math.min((currentTime / duration) * 100, 100)}%` : '0%' }}
              />
            </div>
            <span>{formatTime(duration || currentTrack?.duration || 0)}</span>
          </div>
        </div>

        <div className="volume-control">
          <Volume2 size={19} />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="volume-slider"
            aria-label="Volume"
          />
          <span>{volume}%</span>
        </div>
      </footer>

      <AnimatePresence>
        {editingTrack && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="track-modal"
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
            >
              <div className="modal-heading">
                <div>
                  <p className="eyebrow">{t.editDetails}</p>
                  <h2>{editForm.title || editingTrack.title}</h2>
                </div>
                <button type="button" className="icon-button" onClick={() => setEditingTrackId(null)} aria-label={t.cancel}>
                  <X size={18} />
                </button>
              </div>

              <div className="edit-grid">
                <button
                  type="button"
                  className="cover-editor"
                  onClick={() => coverInputRef.current?.click()}
                  style={{
                    '--cover-hue': getTrackHue(editingTrack.id),
                    backgroundImage: editForm.cover ? `url(${editForm.cover})` : undefined,
                  }}
                >
                  {!editForm.cover && <ImagePlus size={34} />}
                  <span>{t.chooseCover}</span>
                </button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverInput}
                  className="hidden"
                />

                <div className="edit-fields">
                  <label>
                    <span>{t.title}</span>
                    <input value={editForm.title} onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))} />
                  </label>
                  <label>
                    <span>{t.artist}</span>
                    <input value={editForm.artist} onChange={(e) => setEditForm(prev => ({ ...prev, artist: e.target.value }))} />
                  </label>
                  <label>
                    <span>{t.genre}</span>
                    <input value={editForm.genre} onChange={(e) => setEditForm(prev => ({ ...prev, genre: e.target.value }))} />
                  </label>
                  <label>
                    <span>{t.playlistName}</span>
                    <select value={editForm.playlistId} onChange={(e) => setEditForm(prev => ({ ...prev, playlistId: e.target.value }))}>
                      <option value="">{t.all}</option>
                      {playlists.map(playlist => <option key={playlist.id} value={playlist.id}>{playlist.name}</option>)}
                    </select>
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-action" onClick={() => setEditingTrackId(null)}>{t.cancel}</button>
                <button type="button" className="primary-action" onClick={saveTrackEdit}>{t.save}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
