/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Tv, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Twitter, 
  Plus, 
  Play, 
  Star, 
  Award, 
  ChevronRight,
  History,
  ShieldAlert,
  Globe,
  MessageSquare,
  Smartphone,
  Calendar,
  ArrowRight,
  Wifi,
  Battery,
  Signal,
  Zap,
  Flame,
  UserPlus,
  AlertTriangle,
  Youtube,
  Clapperboard,
  Star as StarIcon,
  Video,
  Type,
  Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type Genre = 'Drama' | 'Comedy' | 'Sci-Fi' | 'Horror' | 'Documentary' | 'Action' | 'Animation' | 'Pop' | 'Hip-Hop' | 'R&B' | 'Rock' | 'Electronic';
type Career = 'film' | 'music';

interface Comment {
  id: string;
  user: string;
  text: string;
  rating: number;
}

interface Series {
  id: string;
  title: string;
  genre: Genre;
  season: number;
  budget: number;
  quality: number; // 0-100
  rating: number; // 0-10
  views: number;
  revenue: number;
  releasedAt: number;
  isSequelOf?: string;
  studio: string;
  coverSeed: string;
  soundtrackArtist?: string;
  isCollaboration?: boolean;
  collaborator?: string;
  comments: Comment[];
  hasTrailer?: boolean;
  platforms?: string[];
  isCinemaRelease?: boolean;
}

interface MusicRelease {
  id: string;
  title: string;
  type: 'single' | 'album';
  genre: string;
  quality: number;
  plays: number;
  revenue: number;
  releasedAt: number;
  coverSeed: string;
  comments: Comment[];
  hasVideo?: boolean;
}

interface Artist {
  id: string;
  name: string;
  genre: string;
  popularity: number;
  fee: number;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  seriesTitle: string;
  plays: number;
}

interface Platform {
  id: string;
  name: string;
  marketShare: number;
  color: string;
  isPlayer: boolean;
}

interface Tweet {
  id: string;
  user: string;
  handle: string;
  content: string;
  likes: number;
  retweets: number;
  timestamp: number;
  replies?: { user: string; content: string }[];
}

// --- Constants ---

const GENRES: Genre[] = ['Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Documentary', 'Action', 'Animation', 'Pop', 'Hip-Hop', 'R&B', 'Rock', 'Electronic'];

const GENRE_KEYWORDS: Record<Genre, string[]> = {
  'Drama': ['drama', 'theatre', 'emotion', 'people', 'city'],
  'Comedy': ['comedy', 'smile', 'party', 'fun', 'colorful'],
  'Sci-Fi': ['space', 'robot', 'future', 'tech', 'neon'],
  'Horror': ['dark', 'scary', 'ghost', 'forest', 'night'],
  'Documentary': ['nature', 'history', 'science', 'earth', 'wildlife'],
  'Action': ['explosion', 'car', 'fight', 'fire', 'speed'],
  'Animation': ['cartoon', 'fantasy', 'magic', 'castle', 'dragon'],
  'Pop': ['music', 'singer', 'stage', 'lights', 'dance'],
  'Hip-Hop': ['street', 'graffiti', 'rap', 'urban', 'beat'],
  'R&B': ['soul', 'smooth', 'love', 'night', 'chill'],
  'Rock': ['guitar', 'drums', 'band', 'concert', 'loud'],
  'Electronic': ['synth', 'dj', 'club', 'rave', 'digital']
};

const MUSIC_ARTISTS: Artist[] = [
  { id: 'a1', name: 'Dua Lipa Clone', genre: 'Pop', popularity: 90, fee: 50000 },
  { id: 'a2', name: 'Hans Zimmer Bot', genre: 'Epic', popularity: 95, fee: 80000 },
  { id: 'a3', name: 'The Weeknd AI', genre: 'R&B', popularity: 88, fee: 45000 },
  { id: 'a4', name: 'Billie Eilish Sim', genre: 'Alternative', popularity: 92, fee: 60000 },
  { id: 'a5', name: 'Imagine Dragons X', genre: 'Rock', popularity: 85, fee: 40000 },
];

const STUDIOS = ['Lucasfilms', 'Marvel', 'Pixar', 'HBO', 'Netflix', 'Paramount', 'Blumhouse', 'Warner Bros', 'Universal', 'My Studio'];

const RIVAL_PLATFORMS: Platform[] = [
  { id: 'netflux', name: 'Netflux', marketShare: 30, color: 'bg-red-600', isPlayer: false },
  { id: 'hbm', name: 'HBM Max', marketShare: 18, color: 'bg-purple-600', isPlayer: false },
  { id: 'disney', name: 'Disney-', marketShare: 15, color: 'bg-blue-700', isPlayer: false },
  { id: 'prime', name: 'Prime Video', marketShare: 12, color: 'bg-cyan-500', isPlayer: false },
  { id: 'apple', name: 'Apple TV+', marketShare: 8, color: 'bg-gray-400', isPlayer: false },
  { id: 'paramount', name: 'Paramount+', marketShare: 7, color: 'bg-blue-500', isPlayer: false },
  { id: 'sky', name: 'SkyShowtime', marketShare: 5, color: 'bg-yellow-500', isPlayer: false },
];

const RIVAL_ARTISTS = [
  { id: 'taylor', name: 'Taylor Swift', genre: 'Pop', popularity: 99 },
  { id: 'drake', name: 'Drake', genre: 'Hip-Hop', popularity: 98 },
  { id: 'ed', name: 'Ed Sheeran', genre: 'Pop', popularity: 97 },
  { id: 'ariana', name: 'Ariana Grande', genre: 'Pop', popularity: 96 },
  { id: 'weeknd', name: 'The Weeknd', genre: 'R&B', popularity: 95 },
  { id: 'badbunny', name: 'Bad Bunny', genre: 'Reggaeton', popularity: 94 },
  { id: 'beyonce', name: 'Beyoncé', genre: 'R&B', popularity: 93 },
  { id: 'justin', name: 'Justin Bieber', genre: 'Pop', popularity: 92 },
  { id: 'adele', name: 'Adele', genre: 'Soul', popularity: 91 },
  { id: 'bts', name: 'BTS', genre: 'K-Pop', popularity: 90 },
];

const TWEET_TEMPLATES = {
  success: [
    "Az új {title} évad egyszerűen zseniális! Kötelező darab. #sorozat #binge",
    "Nem tudom abbahagyni a {title} nézését. @{studio} kitett magáért!",
    "Végre valami minőségi tartalom! A {title} minden várakozást felülmúlt.",
  ],
  average: [
    "Elment egynek a {title}, de láttam már jobbat is.",
    "A {title} nem rossz, de a karakterek kicsit laposak.",
    "Vártam már a {title}-t, de többet reméltem tőle.",
  ],
  failure: [
    "Hogy lehetett ennyi pénzt elpazarolni a {title}-re? Borzalmas. 🤮",
    "Senki ne nézze meg a {title}-t, tiszta időpocsékolás.",
    "A {title} a legrosszabb dolog, amit idén láttam. @{studio} mi történt?",
  ],
  news: [
    "BREAKING: A {studio} újabb rekordokat döntöget a nézettségi listákon! 📈",
    "Elemzés: Vajon a {studio} átveszi a vezetést a streaming piacon?",
    "Pletyka: Hatalmas költségvetésű projekt készül a {studio} műhelyében.",
    "Hírek: A {rival} részvényei zuhanni kezdtek a legutóbbi bukás után.",
  ],
  rival: [
    "Nézze nálunk a legújabb kasszasikereket! @{rival} #streaming #mozi",
    "A mi platformunkon nincs reklám, csak minőség. Próbálja ki a @{rival}-t!",
    "Újabb 10 millió előfizető! Köszönjük a bizalmat! 🚀 #growth",
  ]
};

// --- Helper Functions ---

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function App() {
  // --- State ---
  const [gameStarted, setGameStarted] = useState(false);
  const [career, setCareer] = useState<Career>('film');
  const [studioName, setStudioName] = useState('');
  const [money, setMoney] = useState(500000);
  const [fans, setFans] = useState(1000);
  const [reputation, setReputation] = useState(50);
  const [seriesHistory, setSeriesHistory] = useState<Series[]>([]);
  const [musicHistory, setMusicHistory] = useState<MusicRelease[]>([]);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedSequelId, setSelectedSequelId] = useState<string | undefined>(undefined);
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState(1);
  const [trendingGenre, setTrendingGenre] = useState<Genre>('Dráma');
  const [phoneView, setPhoneView] = useState<'home' | 'twitter' | 'lucasfilms' | 'dashboard' | 'production' | 'market' | 'spotify' | 'series_detail' | 'casting' | 'scandal' | 'awards' | 'youtube' | 'cinema' | 'settings'>('home');
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | undefined>(undefined);
  const [twitterTab, setTwitterTab] = useState<'feed' | 'profile'>('feed');
  const [showTweetComposer, setShowTweetComposer] = useState(false);
  const [userTweetContent, setUserTweetContent] = useState('');
  const [showSequelDropdown, setShowSequelDropdown] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [rivalSongs, setRivalSongs] = useState<Song[]>([]);
  
  // New Mechanics States
  const [actorSkill, setActorSkill] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [wonAwards, setWonAwards] = useState<{ name: string; seriesTitle: string }[]>([]);
  const [scandalText, setScandalText] = useState('');
  const [awardMessage, setAwardMessage] = useState('');

  // --- Save/Load Logic ---

  const saveGame = async (data: any) => {
    try {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  useEffect(() => {
    const loadGame = async () => {
      try {
        const res = await fetch('/api/save');
        if (res.ok) {
          const data = await res.json();
          setStudioName(data.studioName);
          setCareer(data.career || 'film');
          setMoney(data.money);
          setFans(data.fans);
          setReputation(data.reputation);
          setSeriesHistory(data.seriesHistory);
          setMusicHistory(data.musicHistory || []);
          setTweets(data.tweets);
          setWeek(data.week);
          setDay(data.day);
          setActorSkill(data.actorSkill || 0);
          setTotalProfit(data.totalProfit || 0);
          setTotalViews(data.totalViews || 0);
          setWonAwards(data.wonAwards || []);
          setRivalSongs(data.rivalSongs || []);
          setGameStarted(true);
        }
      } catch (e) {
        console.error("Load failed", e);
      }
    };
    loadGame();
  }, []);

  useEffect(() => {
    if (gameStarted) {
      saveGame({
        studioName,
        career,
        money,
        fans,
        reputation,
        seriesHistory,
        musicHistory,
        tweets,
        week,
        day,
        actorSkill,
        totalProfit,
        totalViews,
        wonAwards,
        rivalSongs
      });
    }
  }, [money, fans, reputation, seriesHistory, musicHistory, tweets, week, day, gameStarted, career, studioName, actorSkill, totalProfit, totalViews, wonAwards, rivalSongs]);

  // --- Derived State ---
  const playerPlatform = useMemo(() => ({
    id: 'player',
    name: studioName || 'Saját Stúdió',
    color: 'bg-emerald-500',
    isPlayer: true
  }), [studioName]);

  const playerMarketShare = useMemo(() => {
    const totalFans = fans + 1000000; // Total market pool
    return (fans / totalFans) * 100;
  }, [fans]);

  const allPlatforms = useMemo(() => {
    const rivals = RIVAL_PLATFORMS.map(r => ({
      ...r,
      marketShare: r.marketShare * (1 - (playerMarketShare / 100))
    }));
    
    return [
      { ...playerPlatform, marketShare: playerMarketShare },
      ...rivals
    ].sort((a, b) => b.marketShare - a.marketShare);
  }, [playerPlatform, playerMarketShare]);

  // --- Effects ---
  
  // Trending genre changes every 4 weeks
  useEffect(() => {
    if (week % 4 === 0) {
      const newGenre = GENRES[Math.floor(Math.random() * GENRES.length)];
      setTrendingGenre(newGenre);
      addTweet("TrendFigyelő", "trends", `Mostanában mindenki a ${newGenre} sorozatokról beszél! 🔥 #trending`, 1000, 200);
    }
  }, [week]);

  // Rival events every 5 weeks
  useEffect(() => {
    if (week > 1 && week % 5 === 0) {
      const rival = RIVAL_PLATFORMS[Math.floor(Math.random() * RIVAL_PLATFORMS.length)];
      addTweet(rival.name, rival.id, `Bejelentettük az új exkluzív sorozatunkat! Készüljetek! 🚀 #streaming #rivals`, 500, 100);
      setFans(prev => Math.max(0, prev - 500)); // Rivals steal some fans
    }
  }, [week]);

  // --- Game Logic ---

  const resetGame = () => {
    if (confirm("Are you sure you want to reset the game? All progress will be lost.")) {
      setGameStarted(false);
      setStudioName('');
      setMoney(500000);
      setFans(1000);
      setReputation(50);
      setSeriesHistory([]);
      setMusicHistory([]);
      setTweets([]);
      setWeek(1);
      setDay(1);
      setActorSkill(0);
      setTotalProfit(0);
      setTotalViews(0);
      setWonAwards([]);
      setPhoneView('home');
      // Overwrite save with initial data
      saveGame({
        studioName: '',
        career: 'film',
        money: 500000,
        fans: 1000,
        reputation: 50,
        seriesHistory: [],
        musicHistory: [],
        tweets: [],
        week: 1,
        day: 1,
        actorSkill: 0,
        totalProfit: 0,
        totalViews: 0,
        wonAwards: [],
        rivalSongs: []
      });
    }
  };

  const startNewGame = (name: string, chosenCareer: Career) => {
    if (!name.trim()) return;
    setStudioName(name);
    setCareer(chosenCareer);
    setGameStarted(true);
    if (chosenCareer === 'film') {
      addTweet("System", "system", `Welcome ${name} studio to the streaming wars! 🎬`, 0, 0);
    } else {
      addTweet("System", "system", `Welcome ${name} artist to the world of hit charts! 🎵`, 0, 0);
    }
  };

  const addTweet = (user: string, handle: string, content: string, likes: number, retweets: number, replies?: { user: string; content: string }[]) => {
    const newTweet: Tweet = {
      id: generateId(),
      user,
      handle,
      content,
      likes,
      retweets,
      timestamp: Date.now(),
      replies
    };
    setTweets(prev => [newTweet, ...prev].slice(0, 20));

    // Handle studio tagging reactions
    if (handle === 'player') {
      STUDIOS.forEach(studio => {
        if (studio !== 'Saját Stúdió' && content.toLowerCase().includes(`@${studio.toLowerCase()}`)) {
          setTimeout(() => {
            const replyContent = [
              "We're glad to be mentioned! 🎬",
              "We're watching you! 👀",
              "Interesting point, let's talk about it! 🤝",
              "You're doing great things! 🔥",
              "We're always open to collaboration! ✨"
            ][Math.floor(Math.random() * 5)];
            
            addTweet(studio, studio.toLowerCase(), replyContent, Math.floor(Math.random() * 100), Math.floor(Math.random() * 20), [
              { user: studioName, content: "Thanks for the reply! 🙏" }
            ]);
          }, 2000);
        }
      });

      // Handle trailer link reactions
      if (content.includes('youtu.be/')) {
        setTimeout(() => {
          const trailerReplies = [
            "Ez az előzetes libabőrös lett! 🔥",
            "Már most imádom a hangulatát! 😍",
            "Végre láthatunk valamit belőle! 🎬",
            "Ez a trailer mindent visz! 🚀",
            "Mikor jön már ki? Alig várom! ✨"
          ];
          
          const numReplies = 3 + Math.floor(Math.random() * 3);
          const replies = Array.from({ length: numReplies }).map(() => ({
            user: "Fan_" + Math.floor(Math.random() * 1000),
            content: trailerReplies[Math.floor(Math.random() * trailerReplies.length)]
          }));

          addTweet("YouTube Bot", "youtube", "A trailer felrobbantotta az internetet! 📈🔥", Math.floor(fans / 5), Math.floor(fans / 10), replies);
          setFans(prev => prev + Math.floor(fans * 0.05));
        }, 3000);
      }
    }
  };

  const nextDay = () => {
    let newDay = day;
    let newWeek = week;
    const totalDays = (week - 1) * 7 + day;

    if (day < 7) {
      newDay = day + 1;
      setDay(newDay);
    } else {
      newDay = 1;
      newWeek = week + 1;
      setDay(newDay);
      setWeek(newWeek);
      
      // Weekly trend change
      if (Math.random() > 0.5) {
        const newTrend = GENRES[Math.floor(Math.random() * GENRES.length)];
        setTrendingGenre(newTrend);
        addTweet("TrendBot", "trends", `Új piaci trend: A ${newTrend} ${career === 'film' ? 'sorozatok' : 'zenék'} most a legnépszerűbbek! 🔥`, 1000, 200);
      }
    }
    
    // Daily views and revenue from existing series/music
    let dailyViews = 0;
    let dailyRevenue = 0;
    
    if (career === 'film') {
      const updatedHistory = seriesHistory.map(s => {
        const weeksActive = newWeek - s.releasedAt;
        const decay = Math.max(0.1, 1 - (weeksActive * 0.1));
        const addedViews = Math.floor((s.quality * 1000 + fans * 0.1) * decay * (Math.random() * 0.5 + 0.75));
        const addedRevenue = Math.floor(addedViews * 1.2);
        
        dailyViews += addedViews;
        dailyRevenue += addedRevenue;
        
        return {
          ...s,
          views: s.views + addedViews,
          revenue: s.revenue + addedRevenue
        };
      });
      setSeriesHistory(updatedHistory);
    } else {
      const updatedMusic = musicHistory.map(m => {
        const weeksActive = newWeek - m.releasedAt;
        const decay = Math.max(0.05, 1 - (weeksActive * 0.05));
        const addedPlays = Math.floor((m.quality * 2000 + fans * 0.5) * decay * (Math.random() * 0.5 + 0.75));
        const addedRevenue = Math.floor(addedPlays * 0.8);
        
        dailyViews += addedPlays;
        dailyRevenue += addedRevenue;
        
        return {
          ...m,
          plays: m.plays + addedPlays,
          revenue: m.revenue + addedRevenue
        };
      });
      setMusicHistory(updatedMusic);

      // Update rival songs plays
      setRivalSongs(prev => prev.map(s => ({
        ...s,
        plays: s.plays + Math.floor(Math.random() * 5000 + 2000)
      })));
    }
    
    setMoney(prev => prev + dailyRevenue);
    setTotalProfit(prev => prev + dailyRevenue);
    setTotalViews(prev => prev + dailyViews);

    // Rival Artist Releases
    // Every 8 days: Single
    if (totalDays % 8 === 0) {
      const artist = RIVAL_ARTISTS[Math.floor(Math.random() * RIVAL_ARTISTS.length)];
      const title = ["Midnight", "Summer Vibes", "Heartbreak", "Neon Lights", "The Journey", "Lost in Love"][Math.floor(Math.random() * 6)];
      addTweet(artist.name, artist.id, `Megjelent az új dalom: ${title}! 🎵 #single #newmusic`, 15000, 4000);
      setFans(prev => Math.max(0, prev - 200)); // Rivals steal some fans
      
      const newRivalSong: Song = {
        id: generateId(),
        title,
        artist: artist.name,
        seriesTitle: "Single",
        plays: Math.floor(Math.random() * 50000 + 20000)
      };
      setRivalSongs(prev => [newRivalSong, ...prev].slice(0, 20));
    }

    // Every 60 days: Album
    if (totalDays % 60 === 0) {
      const artist = RIVAL_ARTISTS[Math.floor(Math.random() * RIVAL_ARTISTS.length)];
      const title = ["The Masterpiece", "Evolution", "Legacy", "New Era", "Unstoppable"][Math.floor(Math.random() * 5)];
      addTweet(artist.name, artist.id, `VÉGRE ITT VAN! Megjelent az új albumom: ${title}! 💿🔥 #album #legendary`, 50000, 15000);
      setFans(prev => Math.max(0, prev - 1000));

      const newRivalAlbum: Song = {
        id: generateId(),
        title,
        artist: artist.name,
        seriesTitle: "Album",
        plays: Math.floor(Math.random() * 200000 + 100000)
      };
      setRivalSongs(prev => [newRivalAlbum, ...prev].slice(0, 20));
    }

    // Random events and tweets
    const eventType = Math.random();
    
    if (eventType > 0.7) {
      // Fan tweet
      const users = ["Rajongó", "Kritikus", "Néző", "BingeWatcher", "ZeneFan", "SlágerVadász", "VinylGyűjtő"];
      const user = users[Math.floor(Math.random() * users.length)];
      const templates = career === 'film' ? [
        "Mikor jön már valami új a @{studio}-tól?",
        "Imádom a streaming háborút, annyi a jó tartalom! 🍿",
        "A @{studio} a kedvenc platformom jelenleg.",
        "Remélem lesz folytatása a legutóbbi sorozatnak.",
        "Valaki tudja, mikor jön a következő nagy durranás?",
      ] : [
        "Mikor jön már új dal @{studio}-tól?",
        "Imádom az új slágereket, @{studio} a legjobb! 🎵",
        "A @{studio} zenéi egész nap a fejemben ragadnak.",
        "Remélem lesz új album hamarosan.",
        "Valaki tudja, mikor lesz a következő koncert?",
      ];
      const content = templates[Math.floor(Math.random() * templates.length)].replace('{studio}', studioName);
      addTweet(user, "user_" + Math.floor(Math.random() * 100), content, Math.floor(Math.random() * 100), Math.floor(Math.random() * 20));
    } else if (eventType > 0.4) {
      // News tweet
      const newsOutlets = ["MediaNews", "VarietyClone", "HollywoodReporter", "MusicDaily", "GlobalMedia", "DailyEntertainment"];
      const outlet = newsOutlets[Math.floor(Math.random() * newsOutlets.length)];
      const rival = career === 'film' ? RIVAL_PLATFORMS[Math.floor(Math.random() * RIVAL_PLATFORMS.length)].name : RIVAL_ARTISTS[Math.floor(Math.random() * RIVAL_ARTISTS.length)].name;
      const templates = [
        ...TWEET_TEMPLATES.news,
        "Elemzés: A @{studio} stratégiája megváltoztathatja a piacot.",
        "Hírek: Újabb befektetők érkeztek a @{studio} mögé! 💰",
      ];
      const content = templates[Math.floor(Math.random() * templates.length)]
        .replace('{studio}', studioName)
        .replace('{rival}', rival);
      addTweet(outlet, "news_bot", content, Math.floor(Math.random() * 500), Math.floor(Math.random() * 100));
    } else {
      // Rival tweet
      const rival = RIVAL_PLATFORMS[Math.floor(Math.random() * RIVAL_PLATFORMS.length)];
      const templates = [
        ...TWEET_TEMPLATES.rival,
        "Nálunk nincsenek technikai hibák, csak tiszta élmény. @{rival}",
        "A @{rival} előfizetői száma átlépte a bűvös határt! 🎊",
        "Készüljön: A @{rival} jövő héten valami hatalmasat villant!",
      ];
      const content = templates[Math.floor(Math.random() * templates.length)]
        .replace('{rival}', rival.name);
      addTweet(rival.name, rival.id, content, Math.floor(Math.random() * 800), Math.floor(Math.random() * 200));
    }

    // Rival music release - More frequent
    if (Math.random() > 0.85) {
      const rival = RIVAL_PLATFORMS[Math.floor(Math.random() * RIVAL_PLATFORMS.length)];
      const artist = MUSIC_ARTISTS[Math.floor(Math.random() * MUSIC_ARTISTS.length)];
      const newRivalSong: Song = {
        id: generateId(),
        title: `${rival.name} Exclusive Hit`,
        artist: artist.name,
        seriesTitle: "Rival Original",
        plays: Math.floor(Math.random() * 1000000)
      };
      setRivalSongs(prev => [newRivalSong, ...prev].slice(0, 10));
      addTweet(artist.name, "artist", `Hallgassátok az új dalomat, ami már elérhető a @${rival.name} felületén! 🎧 #newmusic`, 8000, 2500);
    }
    
    // Random daily events
    if (Math.random() > 0.9) {
      const positive = Math.random() > 0.5;
      if (positive) {
        const bonus = Math.floor(Math.random() * 50000) + 10000;
        setMoney(prev => prev + bonus);
        addTweet("Bank", "system", `Váratlan adóvisszatérítés érkezett: +$${bonus.toLocaleString()}! 💰`, 0, 0);
      } else {
        const loss = Math.floor(Math.random() * 30000) + 5000;
        setMoney(prev => Math.max(0, prev - loss));
        addTweet("Adóhivatal", "system", `Váratlan karbantartási költség merült fel: -$${loss.toLocaleString()}! 💸`, 0, 0);
      }
    }
  };

  const createMusicRelease = (title: string, type: 'single' | 'album', genre: string, budget: number, coverSeed: string) => {
    if (money < budget) {
      alert("Nincs elég pénzed!");
      return;
    }

    setMoney(prev => prev - budget);
    
    // Quality based on budget and luck
    const quality = Math.floor((budget / 100000) * 20 + Math.random() * 40 + 40);
    const rating = (quality / 10).toFixed(1);
    
    // Initial plays based on quality and fans
    const plays = Math.floor(quality * 500 + fans * 2);
    const revenue = Math.floor(plays * 0.5);

    const comments: Comment[] = Array.from({ length: 3 }).map(() => ({
      id: generateId(),
      user: "Fan_" + Math.floor(Math.random() * 1000),
      text: parseFloat(rating) > 7 ? "Ez a dal zseniális! 🔥" : parseFloat(rating) > 4 ? "Nem rossz, de hallottam már jobbat." : "Ez mi volt? 🤮",
      rating: parseFloat(rating)
    }));

    const newRelease: MusicRelease = {
      id: generateId(),
      title,
      type,
      genre,
      quality,
      plays,
      revenue,
      releasedAt: week,
      coverSeed,
      comments
    };

    setMusicHistory(prev => [newRelease, ...prev]);
    setMoney(prev => prev + revenue);
    setTotalProfit(prev => prev + (revenue - budget));
    setTotalViews(prev => prev + plays);
    
    setFans(prev => prev + Math.floor(plays * 0.01));
    setReputation(prev => Math.min(100, prev + (quality > 70 ? 5 : -2)));

    addTweet(studioName, "player", `Megjelent az új ${type === 'single' ? 'dalom' : 'albumom'}: ${title}! 🎵 Hallgassátok mindenhol! #newmusic`, 5000, 1000);
    
    setShowCreator(false);
  };

  const createSeries = (title: string, genre: Genre, budget: number, studio: string, coverSeed: string, isSequelOf?: string, artistId?: string, isCollaboration?: boolean, collaborator?: string) => {
    let actualBudget = budget;
    if (isCollaboration) {
      actualBudget = budget * 0.5; // Collaborator pays half
    }

    if (money < actualBudget) {
      alert("Nincs elég pénzed!");
      return;
    }

    let totalBudget = actualBudget;
    let artistName: string | undefined;
    
    if (artistId) {
      const artist = MUSIC_ARTISTS.find(a => a.id === artistId);
      if (artist) {
        totalBudget += artist.fee;
        artistName = artist.name;
      }
    }

    if (money < totalBudget) {
      alert("Nincs elég pénzed az előadó kifizetésére!");
      return;
    }

    setMoney(prev => prev - totalBudget);
    
    // Calculate quality based on budget and luck
    const baseQuality = (budget / 1000000) * 50; 
    const luck = Math.random() * 40;
    const reputationBonus = reputation / 5;
    const sequelBonus = isSequelOf ? 15 : 0;
    const trendBonus = genre === trendingGenre ? 10 : 0;
    const musicBonus = artistId ? 12 : 0;
    const skillBonus = actorSkill * 2;
    const collabBonus = isCollaboration ? 15 : 0;
    
    const quality = Math.min(100, Math.max(10, baseQuality + luck + reputationBonus + sequelBonus + trendBonus + musicBonus + skillBonus + collabBonus));
    const rating = Number((quality / 10).toFixed(1));
    
    // Calculate views and revenue
    const baseViews = (fans * 2) + (quality * 5000);
    const views = Math.floor(baseViews * (1 + (Math.random() * 0.5)));
    let revenue = Math.floor(views * 1.5); 
    
    if (isCollaboration) {
      revenue = Math.floor(revenue * 0.6); // You get 60% of revenue in collab
    }

    const fanNames = ["Gábor", "Anna", "Péter", "Zsófi", "Laci", "Dóra", "Bence", "Kata", "Attila", "Eszter"];
    const positiveComments = [
      "Imádtam minden percét!", "Zseniális alakítások.", "Várom a következő évadot!", 
      "A látványvilág lenyűgöző.", "Végre valami értelmes sorozat."
    ];
    const negativeComments = [
      "Kicsit unalmas volt.", "Többet vártam.", "A történet néhol zavaros.", 
      "Nem az én stílusom.", "Pénzkidobás volt."
    ];

    const comments: Comment[] = Array.from({ length: 5 }).map(() => {
      const isPositive = Math.random() > 0.4;
      const pool = isPositive ? positiveComments : negativeComments;
      return {
        id: generateId(),
        user: fanNames[Math.floor(Math.random() * fanNames.length)],
        text: pool[Math.floor(Math.random() * pool.length)],
        rating: isPositive ? 8 + Math.random() * 2 : 2 + Math.random() * 4
      };
    });

    if (isCollaboration && collaborator) {
      comments.unshift({
        id: generateId(),
        user: collaborator,
        text: `Fantasztikus volt az együttműködés a @${studioName} stúdióval! A minőség magáért beszél. 🤝✨`,
        rating: 10
      });
    }

    const newSeries: Series = {
      id: generateId(),
      title,
      genre,
      season: isSequelOf ? (seriesHistory.find(s => s.id === isSequelOf)?.season || 1) + 1 : 1,
      budget: budget, // Original budget for stats
      quality,
      rating,
      views,
      revenue,
      releasedAt: week,
      isSequelOf,
      studio,
      coverSeed,
      soundtrackArtist: artistName,
      isCollaboration,
      collaborator,
      comments,
      platforms: []
    };

    if (artistName) {
      const newSong: Song = {
        id: generateId(),
        title: `${title} Main Theme`,
        artist: artistName,
        seriesTitle: title,
        plays: Math.floor(views * 0.3)
      };
      setSongs(prev => [newSong, ...prev]);
      addTweet(artistName, "artist", `Hatalmas megtiszteltetés volt megírni a ${title} főcímdalát! Hallgassátok Spotify-on! 🎵 #soundtrack`, 2000, 500);
    }

    if (isCollaboration && collaborator) {
      addTweet(collaborator, collaborator.toLowerCase(), `Büszkék vagyunk a közös munkára a @${studioName} stúdióval! A ${title} már elérhető! 🤝✨`, 5000, 1200, [
        { user: studioName, content: "Köszönjük a lehetőséget, nagyszerű lett! 🚀" },
        { user: "Fan_99", content: "A két kedvenc stúdióm együtt! 😍" }
      ]);
    }

    setSeriesHistory(prev => [newSeries, ...prev]);
    setMoney(prev => prev + revenue);
    setTotalProfit(prev => prev + (revenue - totalBudget));
    setTotalViews(prev => prev + views);
    
    // Reputation and Fan gain
    const repGain = isCollaboration ? Math.floor(quality / 10) + 2 : Math.floor(quality / 15);
    const fanGain = Math.floor(views * 0.05 * (rating / 10));
    
    setReputation(prev => Math.min(100, Math.max(0, prev + repGain + (rating > 7 ? 2 : rating < 4 ? -5 : 0))));
    setFans(prev => prev + fanGain);
    
    setShowCreator(false);

    // Generate Tweets
    const sentiment = rating > 7 ? 'success' : rating > 4 ? 'average' : 'failure';
    const templates = TWEET_TEMPLATES[sentiment];
    const tweetContent = templates[Math.floor(Math.random() * templates.length)]
      .replace('{title}', title)
      .replace('{studio}', studioName);
    
    setTimeout(() => {
      addTweet("Felhasználó", "fan_" + Math.floor(Math.random() * 1000), tweetContent, Math.floor(views / 1000), Math.floor(views / 5000));
    }, 1000);
  };

  const releaseToCinema = (seriesId: string) => {
    const s = seriesHistory.find(x => x.id === seriesId);
    if (!s) return;
    
    const marketingCost = 500000;
    if (money < marketingCost) {
      alert("Nincs elég pénzed a mozis marketingre ($500,000)!");
      return;
    }
    
    setMoney(prev => prev - marketingCost);
    
    // Cinema performance based on quality and reputation
    const boxOffice = Math.floor((s.quality * 50000 + reputation * 10000) * (Math.random() * 0.5 + 0.75));
    const cinemaFans = Math.floor(boxOffice * 0.01);
    
    setMoney(prev => prev + boxOffice);
    setTotalProfit(prev => prev + (boxOffice - marketingCost));
    setFans(prev => prev + cinemaFans);
    setReputation(prev => Math.min(100, prev + 5));
    
    addTweet("CinemaNews", "cinema", `A ${s.title} hatalmasat ment a mozikban! 🍿 Bevétele: $${(boxOffice/1000000).toFixed(1)}M`, 25000, 8000);
    alert(`A mozipremier sikeres volt! Bevétel: $${boxOffice.toLocaleString()}`);
  };

  // --- Components ---

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#141414] p-8 rounded-3xl border border-white/10 shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-500/20 p-4 rounded-2xl">
              {career === 'film' ? <Tv className="w-12 h-12 text-emerald-500" /> : <Wifi className="w-12 h-12 text-emerald-500 rotate-45" />}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">Entertainment Tycoon</h1>
          <p className="text-gray-400 text-center mb-8 text-sm">Válassz karriert és építsd fel a birodalmadat!</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ml-1">Karrier Választása</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setCareer('film')}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${career === 'film' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-white/5 border-white/10 text-gray-500'}`}
                >
                  <Tv className="w-8 h-8" />
                  <span className="text-xs font-bold uppercase">Film Készítő</span>
                </button>
                <button 
                  onClick={() => setCareer('music')}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${career === 'music' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-white/5 border-white/10 text-gray-500'}`}
                >
                  <Wifi className="w-8 h-8 rotate-45" />
                  <span className="text-xs font-bold uppercase">Zenei Előadó</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                {career === 'film' ? 'Stúdió Neve' : 'Művészneved'}
              </label>
              <input 
                type="text" 
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder={career === 'film' ? "Pl. DreamWorks, HBO..." : "Pl. DJ Star, Pop Queen..."}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button 
              onClick={() => startNewGame(studioName, career)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-4 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              Játék Indítása <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center p-4">
      {/* Main Phone Container */}
      <div className="relative w-[360px] h-[740px] bg-[#000] rounded-[3.5rem] border-[12px] border-[#1a1a1a] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/20">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-[#1a1a1a] rounded-b-3xl z-50 flex items-center justify-center gap-2 px-4">
          <div className="w-2 h-2 bg-black rounded-full" />
          <div className="w-12 h-1.5 bg-black rounded-full" />
        </div>

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-10 pt-4 z-40 text-[11px] font-bold">
          <span>12:00</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Phone Content */}
        <div className="h-full flex flex-col pt-14 bg-black">
          <AnimatePresence mode="wait">
            {phoneView === 'home' ? (
              <motion.div 
                key="home"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex-1 p-8 grid grid-cols-4 gap-y-8 gap-x-4 content-start"
              >
                {/* Dashboard App */}
                <button onClick={() => setPhoneView('dashboard')} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
                    <TrendingUp className="w-8 h-8 text-black" />
                  </div>
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter">Status</span>
                </button>

                {/* Production App */}
                <button onClick={() => setPhoneView('production')} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
                    {career === 'film' ? <Play className="w-8 h-8 text-white fill-current" /> : <Wifi className="w-8 h-8 text-white rotate-45" />}
                  </div>
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter">{career === 'film' ? 'Production' : 'Studio'}</span>
                </button>

                {/* X App */}
                <button onClick={() => setPhoneView('twitter')} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
                    <Twitter className="w-8 h-8 text-black" />
                  </div>
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter">X</span>
                </button>

                {/* Studio App */}
                {career === 'film' && (
                  <button onClick={() => setPhoneView('lucasfilms')} className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-gradient-to-b from-blue-800 to-blue-950 rounded-2xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform border border-white/20 overflow-hidden">
                      <span className="text-[7px] font-black text-white leading-none text-center tracking-tighter px-1">
                        {studioName.length > 10 ? studioName.substring(0, 8).toUpperCase() + '...' : studioName.toUpperCase()}<br/>+
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter truncate w-14 text-center">
                      {studioName.substring(0, 1).toUpperCase()}+
                    </span>
                  </button>
                )}

                {/* Market App */}
                <button onClick={() => setPhoneView('market')} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter">Market</span>
                </button>

                {/* Spotify App */}
                <button onClick={() => setPhoneView('spotify')} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-[#1DB954] rounded-2xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <Wifi className="w-5 h-5 text-[#1DB954] rotate-45" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter">Spotify</span>
                </button>

                {/* Save Button (as an app) */}
                <button 
                  onClick={() => {
                    saveGame({ studioName, career, money, fans, reputation, seriesHistory, musicHistory, tweets, week, day, actorSkill, totalProfit, totalViews, wonAwards, rivalSongs });
                    alert("Game saved!");
                  }} 
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 bg-gray-600 rounded-2xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
                    <History className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter">Save</span>
                </button>

                {/* Casting App */}
                {career === 'film' && (
                  <button onClick={() => setPhoneView('casting')} className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
                      <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter">Casting</span>
                  </button>
                )}

                {/* Scandal App */}
                <button onClick={() => setPhoneView('scandal')} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter">Scandal</span>
                </button>

                {/* Awards App */}
                <button onClick={() => setPhoneView('awards')} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
                    <Award className="w-8 h-8 text-black" />
                  </div>
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter">Awards</span>
                </button>

                {/* YouTube App */}
                <button onClick={() => setPhoneView('youtube')} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
                    <Youtube className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter">YouTube</span>
                </button>

                {/* Settings App */}
                <button onClick={() => setPhoneView('settings')} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter">Settings</span>
                </button>

                {/* Next Day Button - Prominent on Home */}
                <div className="col-span-4 mt-8">
                  <button 
                    onClick={nextDay}
                    className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
                  >
                    NEXT DAY <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : phoneView === 'casting' ? (
              <motion.div 
                key="casting"
                initial={{ opacity: 0, x: 360 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 360 }}
                className="flex-1 flex flex-col bg-[#0a0a0a]"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-md sticky top-0 z-30">
                  <button onClick={() => setPhoneView('home')} className="text-sm text-pink-500 font-bold">Back</button>
                  <span className="text-xs font-black uppercase tracking-widest">Casting</span>
                  <div className="w-10" />
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  <div className="bg-pink-500/10 rounded-3xl p-6 border border-pink-500/20 text-center">
                    <UserPlus className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                    <h2 className="text-xl font-black text-white uppercase mb-2">Hire {career === 'film' ? 'Actor' : 'Producer'}</h2>
                    <p className="text-xs text-gray-400 mb-6">Increase your {career === 'film' ? 'production' : 'music'} quality with professionals!</p>
                    <div className="text-2xl font-black text-white mb-6">$300,000</div>
                    <button 
                      onClick={() => {
                        if (money < 300000) {
                          alert("Not enough money!");
                          return;
                        }
                        setMoney(prev => prev - 300000);
                        setActorSkill(prev => prev + Math.floor(Math.random() * 5) + 1);
                        alert(career === 'film' ? "Actor hired!" : "Producer hired!");
                      }}
                      className="w-full py-4 bg-pink-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-pink-600 transition-colors"
                    >
                      Hire
                    </button>
                  </div>
                  <div className="bg-[#141414] rounded-3xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-bold uppercase">Current Skill</span>
                      <span className="text-xl font-black text-pink-500">{actorSkill}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : phoneView === 'scandal' ? (
              <motion.div 
                key="scandal"
                initial={{ opacity: 0, x: 360 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 360 }}
                className="flex-1 flex flex-col bg-[#0a0a0a]"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-md sticky top-0 z-30">
                  <button onClick={() => setPhoneView('home')} className="text-sm text-red-500 font-bold">Back</button>
                  <span className="text-xs font-black uppercase tracking-widest">Scandal</span>
                  <div className="w-10" />
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  <div className="bg-red-600/10 rounded-3xl p-6 border border-red-600/20 text-center">
                    <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <h2 className="text-xl font-black text-white uppercase mb-2">Generate Scandal</h2>
                    <p className="text-xs text-gray-400 mb-6">Scandal can bring hype, but you can also be cancelled!</p>
                    <button 
                      onClick={() => {
                        const roll = Math.random();
                        if (roll < 0.5) {
                          setReputation(prev => Math.min(100, prev + 10));
                          setTotalViews(prev => prev + 100000);
                          setScandalText("Scandal = hype 😈 Views jumped!");
                        } else {
                          setReputation(prev => Math.max(0, prev - 15));
                          setFans(prev => Math.max(0, prev - 50000));
                          setScandalText("Cancel wave 😈🔥 Fans are leaving!");
                        }
                      }}
                      className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                  {scandalText && (
                    <div className="bg-[#141414] rounded-3xl p-6 border border-white/10 animate-pulse">
                      <p className="text-sm font-bold text-white text-center italic">"{scandalText}"</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : phoneView === 'awards' ? (
              <motion.div 
                key="awards"
                initial={{ opacity: 0, x: 360 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 360 }}
                className="flex-1 flex flex-col bg-[#0a0a0a]"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-md sticky top-0 z-30">
                  <button onClick={() => setPhoneView('home')} className="text-sm text-yellow-500 font-bold">Back</button>
                  <span className="text-xs font-black uppercase tracking-widest">Awards</span>
                  <div className="w-10" />
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  <div className="bg-yellow-500/10 rounded-3xl p-6 border border-yellow-500/20 text-center">
                    <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-xl font-black text-white uppercase mb-2">Award Season</h2>
                    <p className="text-xs text-gray-400 mb-6">Based on your reputation, you have a chance to win prestigious awards!</p>
                    <button 
                      onClick={() => {
                        if (seriesHistory.length === 0 && musicHistory.length === 0) {
                          alert("No releases to nominate yet!");
                          return;
                        }
                        
                        if (Math.random() < reputation / 100) {
                          setReputation(prev => Math.min(100, prev + 20));
                          setMoney(prev => prev + 500000);
                          const awardName = career === 'film' ? ["Golden Globe", "Emmy", "Oscar", "BAFTA"][Math.floor(Math.random() * 4)] : ["Grammy", "MTV VMA", "Billboard", "Brit Award"][Math.floor(Math.random() * 4)];
                          
                          const winningTitle = career === 'film' 
                            ? (seriesHistory.length > 0 ? seriesHistory[Math.floor(Math.random() * seriesHistory.length)].title : "Unknown")
                            : (musicHistory.length > 0 ? musicHistory[Math.floor(Math.random() * musicHistory.length)].title : "Unknown");

                          setWonAwards(prev => [...prev, { name: awardName, seriesTitle: winningTitle }]);
                          setAwardMessage(`You won an award: ${awardName} 🏆🔥 (${winningTitle})`);
                        } else {
                          setAwardMessage("Unfortunately, you didn't win anything this year.");
                        }
                      }}
                      className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-600 transition-colors"
                    >
                      Nominate
                    </button>
                  </div>
                  {awardMessage && (
                    <div className="bg-[#141414] rounded-3xl p-6 border border-white/10">
                      <p className="text-sm font-bold text-white text-center">{awardMessage}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Won Awards</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {wonAwards.length === 0 ? (
                        <div className="text-center py-8 text-white/20 italic text-xs bg-white/5 rounded-2xl border border-white/5">No awards yet.</div>
                      ) : (
                        wonAwards.map((award, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Award className="w-3 h-3 text-yellow-500" />
                              <span className="text-[10px] font-bold text-white">{award.name}</span>
                            </div>
                            <span className="text-[9px] text-gray-500 italic ml-5">{award.seriesTitle}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : phoneView === 'settings' ? (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, x: 360 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 360 }}
                className="flex-1 flex flex-col bg-[#0a0a0a]"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-md sticky top-0 z-30">
                  <button onClick={() => setPhoneView('home')} className="text-sm text-gray-400 font-bold">Back</button>
                  <span className="text-xs font-black uppercase tracking-widest">Settings</span>
                  <div className="w-10" />
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  <div className="bg-red-600/10 rounded-3xl p-6 border border-red-600/20">
                    <h2 className="text-lg font-black text-white uppercase mb-2">Danger Zone</h2>
                    <p className="text-xs text-gray-400 mb-6">Resetting the game will delete all your progress permanently.</p>
                    <button 
                      onClick={resetGame}
                      className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" /> Reset Game
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                    <h2 className="text-lg font-black text-white uppercase mb-2">Career</h2>
                    <p className="text-xs text-gray-400 mb-6">Switch your career path. This will reset your progress but you keep your studio name.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => {
                          if (confirm("Switch to Film Career? Progress will be reset.")) {
                            setCareer('film');
                            setMoney(500000);
                            setFans(1000);
                            setReputation(50);
                            setSeriesHistory([]);
                            setMusicHistory([]);
                            setTweets([]);
                            setWeek(1);
                            setDay(1);
                            setPhoneView('home');
                          }
                        }}
                        className={`py-3 rounded-xl font-black uppercase tracking-widest text-[10px] ${career === 'film' ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'}`}
                      >
                        Film
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Switch to Music Career? Progress will be reset.")) {
                            setCareer('music');
                            setMoney(500000);
                            setFans(1000);
                            setReputation(50);
                            setSeriesHistory([]);
                            setMusicHistory([]);
                            setTweets([]);
                            setWeek(1);
                            setDay(1);
                            setPhoneView('home');
                          }
                        }}
                        className={`py-3 rounded-xl font-black uppercase tracking-widest text-[10px] ${career === 'music' ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'}`}
                      >
                        Music
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : phoneView === 'youtube' ? (
              <motion.div 
                key="youtube"
                initial={{ opacity: 0, x: 360 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 360 }}
                className="flex-1 flex flex-col bg-[#0f0f0f]"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0f0f0f]/80 backdrop-blur-md sticky top-0 z-30">
                  <button onClick={() => setPhoneView('home')} className="text-sm text-red-600 font-bold">Vissza</button>
                  <div className="flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-red-600 fill-current" />
                    <span className="text-xs font-black uppercase tracking-widest text-white">YouTube Studio</span>
                  </div>
                  <div className="w-10" />
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pb-24">
                  <div className="bg-red-600/10 rounded-3xl p-6 border border-red-600/20 text-center">
                    <Play className="w-12 h-12 text-red-600 mx-auto mb-4 fill-current" />
                    <h2 className="text-xl font-black text-white uppercase mb-2">
                      {career === 'film' ? 'Előzetes Kiadása' : 'Videóklip Feltöltése'}
                    </h2>
                    <p className="text-xs text-gray-400 mb-6">
                      {career === 'film' 
                        ? 'Egy jól sikerült trailer hatalmas hype-ot generálhat!' 
                        : 'Egy látványos videóklip megsokszorozhatja a hallgatottságot!'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      {career === 'film' ? 'Válassz Sorozatot' : 'Válassz Zenét'}
                    </h3>
                    {career === 'film' ? (
                      seriesHistory.length === 0 ? (
                        <div className="text-center py-8 text-white/20 italic text-xs bg-white/5 rounded-2xl border border-white/5">
                          Még nincs sorozatod.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {seriesHistory.map(s => (
                            <div key={s.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10">
                                  <img src={`https://picsum.photos/seed/${s.coverSeed || s.id}/100/100`} className="w-full h-full object-cover" alt="Cover" referrerPolicy="no-referrer" />
                                </div>
                                <div>
                                  <div className="text-xs font-black text-white uppercase">{s.title}</div>
                                  <div className="text-[10px] text-gray-500 font-bold uppercase">{s.genre} • S{s.season}</div>
                                </div>
                              </div>
                              {s.hasTrailer ? (
                                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[8px] font-black uppercase tracking-widest">Kiadva</div>
                              ) : (
                                <button 
                                  onClick={() => {
                                    if (money < 50000) {
                                      alert("Nincs elég pénzed! ($50,000 szükséges)");
                                      return;
                                    }
                                    setMoney(prev => prev - 50000);
                                    setFans(prev => prev + 10000 + Math.floor(Math.random() * 20000));
                                    setReputation(prev => Math.min(100, prev + 5));
                                    setSeriesHistory(prev => prev.map(x => x.id === s.id ? { ...x, hasTrailer: true } : x));
                                    
                                    const trailerLink = `youtu.be/${s.id.substring(0, 8)}`;
                                    alert(`Előzetes kiadva! Link: ${trailerLink}\nOszd meg Twitteren a hype-ért!`);
                                  }}
                                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
                                >
                                  Kiadás ($50k)
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      musicHistory.length === 0 ? (
                        <div className="text-center py-8 text-white/20 italic text-xs bg-white/5 rounded-2xl border border-white/5">
                          Még nincs kiadott zenéd.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {musicHistory.map(m => (
                            <div key={m.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10">
                                  <img src={`https://picsum.photos/seed/music_${m.genre}_${m.coverSeed}/100/100`} className="w-full h-full object-cover" alt="Cover" referrerPolicy="no-referrer" />
                                </div>
                                <div>
                                  <div className="text-xs font-black text-white uppercase">{m.title}</div>
                                  <div className="text-[10px] text-gray-500 font-bold uppercase">{m.genre} • {m.type.toUpperCase()}</div>
                                </div>
                              </div>
                              {m.hasVideo ? (
                                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[8px] font-black uppercase tracking-widest">Feltöltve</div>
                              ) : (
                                <button 
                                  onClick={() => {
                                    const cost = 100000;
                                    if (money < cost) {
                                      alert(`Nincs elég pénzed! ($${cost.toLocaleString()} szükséges)`);
                                      return;
                                    }
                                    setMoney(prev => prev - cost);
                                    
                                    // Video clip impact
                                    const extraPlays = Math.floor(m.plays * (0.5 + Math.random()));
                                    const extraFans = Math.floor(extraPlays * 0.1);
                                    
                                    setMusicHistory(prev => prev.map(x => x.id === m.id ? { ...x, hasVideo: true, plays: x.plays + extraPlays } : x));
                                    setFans(prev => prev + extraFans);
                                    setReputation(prev => Math.min(100, prev + 8));
                                    
                                    alert(`Videóklip feltöltve! +${extraPlays.toLocaleString()} extra hallgatottság és +${extraFans.toLocaleString()} új rajongó!`);
                                  }}
                                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
                                >
                                  Feltöltés ($100k)
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            ) : phoneView === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, x: 360 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 360 }}
                className="flex-1 flex flex-col bg-[#0a0a0a]"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-md sticky top-0 z-30">
                  <button onClick={() => setPhoneView('home')} className="text-sm text-emerald-500 font-bold">Back</button>
                  <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
                  <div className="w-10" />
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  <div className="bg-[#141414] rounded-3xl p-6 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-bold uppercase">{career === 'film' ? 'Studio' : 'Artist'}</span>
                      <span className="text-sm font-black text-white">{studioName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-bold uppercase">Time</span>
                      <span className="text-sm font-mono text-emerald-500">Week {week}, Day {day}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#141414] rounded-3xl p-4 border border-white/10">
                      <DollarSign className="w-4 h-4 text-emerald-400 mb-2" />
                      <div className="text-lg font-black text-white">${(money / 1000).toFixed(0)}k</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Balance</div>
                    </div>
                    <div className="bg-[#141414] rounded-3xl p-4 border border-white/10">
                      <Users className="w-4 h-4 text-blue-400 mb-2" />
                      <div className="text-lg font-black text-white">{(fans / 1000).toFixed(1)}k</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Fans</div>
                    </div>
                    <div className="bg-[#141414] rounded-3xl p-4 border border-white/10">
                      <Star className="w-4 h-4 text-purple-400 mb-2" />
                      <div className="text-lg font-black text-white">{reputation}%</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Reputation</div>
                    </div>
                    <div className="bg-[#141414] rounded-3xl p-4 border border-white/10">
                      <TrendingUp className="w-4 h-4 text-orange-400 mb-2" />
                      <div className="text-[10px] font-black text-white truncate">{trendingGenre}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Trend</div>
                    </div>
                    <div className="bg-[#141414] rounded-3xl p-4 border border-white/10">
                      <DollarSign className="w-4 h-4 text-yellow-400 mb-2" />
                      <div className="text-lg font-black text-white">${(totalProfit / 1000).toFixed(0)}k</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Profit</div>
                    </div>
                    <div className="bg-[#141414] rounded-3xl p-4 border border-white/10">
                      <Users className="w-4 h-4 text-pink-400 mb-2" />
                      <div className="text-lg font-black text-white">{actorSkill}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">{career === 'film' ? 'Actor Skill' : 'Music Skill'}</div>
                    </div>
                    <div className="bg-[#141414] rounded-3xl p-4 border border-white/10">
                      {career === 'film' ? <Tv className="w-4 h-4 text-cyan-400 mb-2" /> : <Wifi className="w-4 h-4 text-cyan-400 mb-2 rotate-45" />}
                      <div className="text-lg font-black text-white">{(totalViews / 1000000).toFixed(1)}M</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">{career === 'film' ? 'Total Views' : 'Total Plays'}</div>
                    </div>
                  </div>

                  <button 
                    onClick={nextDay}
                    className="w-full bg-white text-black font-black py-5 rounded-3xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3"
                  >
                    NEXT DAY <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ) : phoneView === 'production' ? (
              <motion.div 
                key="production"
                initial={{ opacity: 0, x: 360 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 360 }}
                className="flex-1 flex flex-col bg-[#0a0a0a]"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-md sticky top-0 z-30">
                  <button onClick={() => setPhoneView('home')} className="text-sm text-blue-500 font-bold">Vissza</button>
                  <span className="text-xs font-black uppercase tracking-widest">{career === 'film' ? 'Gyártás' : 'Stúdió'}</span>
                  <div className="w-10" />
                </div>
                
                <div className="flex-1 flex flex-col min-h-0">
                  {career === 'film' ? (
                    <SeriesCreatorForm 
                      money={money} 
                      history={seriesHistory}
                      studioName={studioName}
                      initialSequelId={selectedSequelId}
                      onCreate={(t, g, b, st, s, cs, art) => {
                        createSeries(t, g, b, st, cs, s, art);
                        setSelectedSequelId(undefined);
                        setPhoneView('dashboard');
                      }} 
                    />
                  ) : (
                    <MusicCreatorForm 
                      money={money}
                      onCreate={(t, ty, g, b, cs) => {
                        createMusicRelease(t, ty, g, b, cs);
                        setPhoneView('dashboard');
                      }}
                    />
                  )}
                  <div className="p-6 pt-0">
                    <button 
                      onClick={nextDay}
                      className="w-full bg-white/10 text-white font-black py-4 rounded-2xl border border-white/10 active:scale-95 transition-transform flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
                    >
                      NAP ÁTUGRÁSA <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : phoneView === 'twitter' ? (
              <motion.div 
                key="twitter"
                initial={{ opacity: 0, x: 360 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 360 }}
                className="flex-1 flex flex-col bg-black relative h-full"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-md sticky top-0 z-30">
                  <button onClick={() => setPhoneView('home')} className="text-sm text-sky-400 font-bold">Vissza</button>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setTwitterTab('feed')}
                      className={`text-xs font-black uppercase tracking-widest ${twitterTab === 'feed' ? 'text-white border-b-2 border-sky-500 pb-1' : 'text-gray-500'}`}
                    >
                      Feed
                    </button>
                    <button 
                      onClick={() => setTwitterTab('profile')}
                      className={`text-xs font-black uppercase tracking-widest ${twitterTab === 'profile' ? 'text-white border-b-2 border-sky-500 pb-1' : 'text-gray-500'}`}
                    >
                      Profil
                    </button>
                  </div>
                  <div className="w-10" />
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 pb-24 min-h-0">
                  {twitterTab === 'feed' ? (
                    <AnimatePresence initial={false}>
                      {tweets.map((tweet) => {
                        const isRival = RIVAL_PLATFORMS.some(r => r.id === tweet.handle);
                        const isNews = tweet.handle === 'news_bot';
                        const isSystem = tweet.handle === 'system' || tweet.handle === 'trends';
                        const isUser = tweet.handle === 'player';
                        
                        let avatarColor = "from-emerald-500 to-blue-600";
                        if (isRival) avatarColor = "from-red-500 to-purple-600";
                        if (isNews) avatarColor = "from-blue-400 to-indigo-600";
                        if (isSystem) avatarColor = "from-orange-400 to-yellow-600";
                        if (isUser) avatarColor = "from-sky-400 to-blue-500";

                        return (
                          <motion.div 
                            key={tweet.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-white/5 pb-4 last:border-0"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-9 h-9 bg-gradient-to-br ${avatarColor} rounded-full flex-shrink-0 shadow-md flex items-center justify-center text-[10px] font-black text-white`}>
                                {tweet.user.substring(0, 1)}
                              </div>
                              <div className="overflow-hidden">
                                <div className="flex items-center gap-1">
                                  <div className="font-bold text-xs truncate text-white">{tweet.user}</div>
                                  {(isRival || isNews || isSystem || isUser) && <div className="w-3 h-3 bg-sky-500 rounded-full flex items-center justify-center"><Plus className="w-2 h-2 text-white fill-current" /></div>}
                                </div>
                                <div className="text-gray-500 text-[10px] truncate">@{tweet.handle}</div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-200 mb-3 leading-relaxed">{tweet.content}</p>
                            <div className="flex items-center gap-5 text-gray-500 mb-3">
                              <span className="flex items-center gap-1.5 text-[10px]"><MessageSquare className="w-3.5 h-3.5" /> {tweet.retweets}</span>
                              <span className="flex items-center gap-1.5 text-[10px]"><TrendingUp className="w-3.5 h-3.5" /> {tweet.likes}</span>
                            </div>
                            
                            {tweet.replies && tweet.replies.length > 0 && (
                              <div className="ml-6 space-y-3 border-l border-white/10 pl-4 mt-2">
                                {tweet.replies.map((reply, idx) => (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                                        {reply.user.substring(0, 1)}
                                      </div>
                                      <span className="text-[10px] font-bold text-gray-400">@{reply.user.toLowerCase()}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-300">{reply.content}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center py-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center text-2xl font-black text-white mb-4 shadow-xl">
                          {studioName.substring(0, 1)}
                        </div>
                        <h3 className="text-lg font-black text-white">{studioName}</h3>
                        <p className="text-sm text-gray-500">@player</p>
                        <div className="flex gap-6 mt-4">
                          <div className="text-center">
                            <div className="text-white font-bold">{(fans / 1000).toFixed(1)}k</div>
                            <div className="text-[10px] text-gray-500 uppercase">Követők</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-bold">{reputation}</div>
                            <div className="text-[10px] text-gray-500 uppercase">Hírnév</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">Saját Posztok</h4>
                        {tweets.filter(t => t.handle === 'player').length === 0 ? (
                          <p className="text-xs text-gray-600 italic text-center py-8">Még nem posztoltál semmit.</p>
                        ) : (
                          tweets.filter(t => t.handle === 'player').map(tweet => (
                            <div key={tweet.id} className="border-b border-white/5 pb-4">
                              <p className="text-xs text-gray-200 mb-2">{tweet.content}</p>
                              <div className="flex gap-4 text-[10px] text-gray-500 mb-2">
                                <span>{tweet.likes} Like</span>
                                <span>{tweet.retweets} Retweet</span>
                              </div>
                              {tweet.replies && tweet.replies.length > 0 && (
                                <div className="ml-4 space-y-2 border-l border-white/10 pl-3">
                                  {tweet.replies.map((reply, idx) => (
                                    <div key={idx}>
                                      <span className="text-[9px] font-bold text-gray-500">@{reply.user.toLowerCase()}: </span>
                                      <span className="text-[9px] text-gray-400">{reply.content}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating Post Button */}
                <button 
                  onClick={() => setShowTweetComposer(true)}
                  className="absolute bottom-6 right-6 w-14 h-14 bg-sky-500 rounded-full shadow-xl shadow-sky-500/40 flex items-center justify-center active:scale-90 transition-transform z-40"
                >
                  <Plus className="w-8 h-8 text-white" />
                </button>

                {/* Tweet Composer Modal */}
                <AnimatePresence>
                  {showTweetComposer && (
                    <motion.div 
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 100 }}
                      className="absolute inset-0 z-50 bg-black flex flex-col"
                    >
                      <div className="p-4 flex items-center justify-between border-b border-white/10">
                        <button onClick={() => setShowTweetComposer(false)} className="text-sm text-white">Mégse</button>
                        <button 
                          onClick={() => {
                            if (userTweetContent.trim()) {
                              // Generate reactions based on fans and reputation
                              const baseLikes = Math.floor(fans / 1000 * (reputation / 100));
                              const likes = Math.floor(baseLikes * (Math.random() * 0.5 + 0.5));
                              const retweets = Math.floor(likes / 5);
                              
                              const replyTemplates = [
                                "Imádom! 😍",
                                "Végre valami hír! 🔥",
                                "Alig várom a következőt!",
                                "A legjobb stúdió! 🎬",
                                "Ez nagyon komoly lett.",
                                "Hajrá @{studio}! 🚀",
                                "Mikor jön az új évad?",
                                "Szerintem ez nem volt olyan jó...",
                                "Zseniális! 👏",
                                "Köszönjük az infót!"
                              ];
                              
                              const numReplies = Math.min(5, Math.floor(likes / 10) + 1);
                              const replies = Array.from({ length: numReplies }).map(() => ({
                                user: "Fan_" + Math.floor(Math.random() * 1000),
                                content: replyTemplates[Math.floor(Math.random() * replyTemplates.length)].replace('{studio}', studioName)
                              }));

                              addTweet(studioName, 'player', userTweetContent, likes, retweets, replies);
                              setUserTweetContent('');
                              setShowTweetComposer(false);
                            }
                          }}
                          disabled={!userTweetContent.trim()}
                          className="bg-sky-500 text-white px-4 py-1.5 rounded-full text-sm font-bold disabled:opacity-50"
                        >
                          Posztolás
                        </button>
                      </div>
                      <div className="p-4 flex gap-3">
                        <div className="w-10 h-10 bg-sky-500 rounded-full flex-shrink-0" />
                        <textarea 
                          autoFocus
                          value={userTweetContent}
                          onChange={(e) => setUserTweetContent(e.target.value)}
                          placeholder="Mi történik?"
                          className="flex-1 bg-transparent text-white text-lg outline-none resize-none h-40"
                        />
                      </div>
                      <div className="p-4 border-t border-white/10">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Stúdiók Megjelölése</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {STUDIOS.filter(s => s !== 'Saját Stúdió').map(s => (
                            <button 
                              key={s}
                              onClick={() => setUserTweetContent(prev => prev + ` @${s}`)}
                              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-sky-400 hover:bg-sky-500/10 transition-colors"
                            >
                              @{s}
                            </button>
                          ))}
                        </div>

                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Előzetes Megosztása</p>
                        <div className="flex flex-wrap gap-2">
                          {seriesHistory.filter(s => s.hasTrailer).map(s => (
                            <button 
                              key={s.id}
                              onClick={() => setUserTweetContent(prev => prev + ` Nézzétek meg a ${s.title} előzetesét! youtu.be/${s.id.substring(0, 8)}`)}
                              className="px-3 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full text-[10px] font-bold text-red-500 hover:bg-red-600/20 transition-colors"
                            >
                              {s.title} Trailer
                            </button>
                          ))}
                          {seriesHistory.filter(s => s.hasTrailer).length === 0 && (
                            <p className="text-[10px] text-gray-600 italic">Még nincs kiadott előzetesed.</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : phoneView === 'lucasfilms' ? (
              <motion.div 
                key="lucasfilms"
                initial={{ opacity: 0, x: 360 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 360 }}
                className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden h-full"
              >
                {/* Atmospheric Background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/40 via-transparent to-transparent blur-[100px]" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col h-full">
                  <div className="p-4 flex items-center justify-between bg-black/40 backdrop-blur-xl sticky top-0 z-30">
                    <button onClick={() => setPhoneView('home')} className="text-xs text-white/80 font-bold hover:text-white transition-colors">Vissza</button>
                    <span className="text-[11px] font-black text-white tracking-[0.3em] uppercase">{studioName}+</span>
                    <div className="w-10" />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin scrollbar-thumb-white/10 pb-24 min-h-0">
                    {career === 'film' ? (
                      seriesHistory.length > 0 && (
                        <motion.div 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedSeriesId(seriesHistory[0].id);
                            setPhoneView('series_detail');
                          }}
                          className="relative h-64 rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl border border-white/10"
                        >
                          <img 
                            src={`https://picsum.photos/seed/${seriesHistory[0].coverSeed || seriesHistory[0].id}/400/600`} 
                            className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
                            alt="Hero"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 bg-blue-600 text-[8px] font-black text-white rounded uppercase tracking-widest">Új Megjelenés</span>
                              <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md text-[8px] font-black text-white rounded uppercase tracking-widest">{seriesHistory[0].genre}</span>
                            </div>
                            <h2 className="text-3xl font-black text-white uppercase leading-tight mb-2">{seriesHistory[0].title}</h2>
                            <div className="flex items-center gap-4">
                              <button className="bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                                <Play className="w-3 h-3 fill-current" /> Lejátszás
                              </button>
                              <button className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    ) : (
                      musicHistory.length > 0 && (
                        <motion.div 
                          whileTap={{ scale: 0.98 }}
                          className="relative h-64 rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl border border-white/10"
                        >
                          <img 
                            src={`https://picsum.photos/seed/${musicHistory[0].coverSeed || musicHistory[0].id}/400/600`} 
                            className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
                            alt="Hero"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 bg-emerald-600 text-[8px] font-black text-white rounded uppercase tracking-widest">Új Sláger</span>
                              <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md text-[8px] font-black text-white rounded uppercase tracking-widest">{musicHistory[0].genre}</span>
                            </div>
                            <h2 className="text-3xl font-black text-white uppercase leading-tight mb-2">{musicHistory[0].title}</h2>
                            <div className="flex items-center gap-4">
                              <button className="bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                                <Play className="w-3 h-3 fill-current" /> Hallgatás
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}

                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                          <Award className="w-3 h-3 text-yellow-500" /> {career === 'film' ? 'Legnézettebb' : 'Legnépszerűbb'}
                        </h4>
                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Összes</span>
                      </div>
                      {career === 'film' ? (
                        seriesHistory.length > 0 ? (
                          (() => {
                            const mostViewed = [...seriesHistory].sort((a, b) => b.views - a.views)[0];
                            return (
                              <motion.div 
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  setSelectedSeriesId(mostViewed.id);
                                  setPhoneView('series_detail');
                                }}
                                className="bg-gradient-to-r from-white/10 to-transparent rounded-[2rem] p-4 border border-white/10 flex items-center gap-4 cursor-pointer hover:from-white/15 transition-all"
                              >
                                <div className="w-20 h-24 bg-gray-800 rounded-2xl flex-shrink-0 overflow-hidden shadow-2xl relative">
                                  <img src={`https://picsum.photos/seed/${mostViewed.coverSeed || mostViewed.id}/150/200`} className="w-full h-full object-cover" alt="Poster" referrerPolicy="no-referrer" />
                                  <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[7px] font-black text-white">#1</div>
                                </div>
                                <div className="flex-1">
                                  <div className="font-black text-sm text-white uppercase mb-1">{mostViewed.title}</div>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">{mostViewed.genre}</span>
                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">★ {mostViewed.rating}</span>
                                  </div>
                                  <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{(mostViewed.views / 1000).toFixed(1)}k megtekintés</div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/20" />
                              </motion.div>
                            );
                          })()
                        ) : (
                          <div className="text-[10px] text-gray-600 italic text-center py-8 bg-white/5 rounded-3xl border border-white/5">Nincs adat</div>
                        )
                      ) : (
                        musicHistory.length > 0 ? (
                          (() => {
                            const mostPlayed = [...musicHistory].sort((a, b) => b.plays - a.plays)[0];
                            return (
                              <motion.div 
                                whileTap={{ scale: 0.98 }}
                                className="bg-gradient-to-r from-white/10 to-transparent rounded-[2rem] p-4 border border-white/10 flex items-center gap-4 cursor-pointer hover:from-white/15 transition-all"
                              >
                                <div className="w-20 h-24 bg-gray-800 rounded-2xl flex-shrink-0 overflow-hidden shadow-2xl relative">
                                  <img src={`https://picsum.photos/seed/${mostPlayed.coverSeed || mostPlayed.id}/150/200`} className="w-full h-full object-cover" alt="Poster" referrerPolicy="no-referrer" />
                                  <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[7px] font-black text-white">#1</div>
                                </div>
                                <div className="flex-1">
                                  <div className="font-black text-sm text-white uppercase mb-1">{mostPlayed.title}</div>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">{mostPlayed.genre}</span>
                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">★ {(mostPlayed.quality / 10).toFixed(1)}</span>
                                  </div>
                                  <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{(mostPlayed.plays / 1000).toFixed(1)}k hallgatás</div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/20" />
                              </motion.div>
                            );
                          })()
                        ) : (
                          <div className="text-[10px] text-gray-600 italic text-center py-8 bg-white/5 rounded-3xl border border-white/5">Nincs adat</div>
                        )
                      )}
                    </section>

                    <section>
                      <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-4">{career === 'film' ? 'Katalógus' : 'Diszkográfia'}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {career === 'film' ? (
                          (() => {
                            // Group by title and take the latest season
                            const uniqueSeries = seriesHistory.reduce((acc, current) => {
                              const existing = acc.find(s => s.title === current.title);
                              if (!existing || current.season > existing.season) {
                                if (existing) {
                                  acc = acc.filter(s => s.title !== current.title);
                                }
                                acc.push(current);
                              }
                              return acc;
                            }, [] as Series[]);

                            return uniqueSeries.map(s => {
                              const seasonCount = seriesHistory.filter(x => x.title === s.title).length;
                              return (
                                <motion.div 
                                  key={s.id} 
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    setSelectedSeriesId(s.id);
                                    setPhoneView('series_detail');
                                  }}
                                  className="flex flex-col gap-3 cursor-pointer group"
                                >
                                  <div className="aspect-[2/3] bg-gray-900 rounded-[1.5rem] overflow-hidden border border-white/5 relative shadow-xl">
                                    <img 
                                      src={`https://picsum.photos/seed/${s.coverSeed || s.id}/200/300`} 
                                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
                                      alt="Poster"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl text-[10px] font-black text-emerald-400 border border-white/10">
                                      ★{s.rating}
                                    </div>
                                    {seasonCount > 1 && (
                                      <div className="absolute bottom-3 right-3 bg-blue-600/90 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-widest">
                                        {seasonCount} Évad
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-[11px] font-black text-white/90 truncate uppercase tracking-wider px-1">{s.title}</div>
                                </motion.div>
                              );
                            });
                          })()
                        ) : (
                          musicHistory.map(m => (
                            <motion.div 
                              key={m.id} 
                              whileTap={{ scale: 0.95 }}
                              className="flex flex-col gap-3 cursor-pointer group"
                            >
                              <div className="aspect-[1/1] bg-gray-900 rounded-[1.5rem] overflow-hidden border border-white/5 relative shadow-xl">
                                <img 
                                  src={`https://picsum.photos/seed/${m.coverSeed || m.id}/300/300`} 
                                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
                                  alt="Cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl text-[10px] font-black text-emerald-400 border border-white/10">
                                  ★{(m.quality / 10).toFixed(1)}
                                </div>
                                <div className="absolute bottom-3 right-3 bg-emerald-600/90 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-widest">
                                  {m.type}
                                </div>
                              </div>
                              <div className="text-[11px] font-black text-white/90 truncate uppercase tracking-wider px-1">{m.title}</div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </section>
                  </div>
                </div>
              </motion.div>
            ) : phoneView === 'series_detail' ? (
              <motion.div 
                key="series_detail"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="flex-1 flex flex-col bg-black relative overflow-hidden h-full"
              >
                {(() => {
                  const s = seriesHistory.find(x => x.id === selectedSeriesId);
                  if (!s) return null;
                  return (
                    <>
                      <div className="absolute top-0 left-0 w-full h-96 opacity-40">
                        <img src={`https://picsum.photos/seed/${s.coverSeed || s.id}/400/600`} className="w-full h-full object-cover blur-2xl" alt="Blur" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
                      </div>

                      <div className="relative z-10 flex-1 flex flex-col h-full">
                        <div className="p-4 flex items-center justify-between sticky top-0 z-30">
                          <button onClick={() => setPhoneView('lucasfilms')} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl"><ChevronRight className="w-6 h-6 rotate-180" /></button>
                          <div className="w-10" />
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10 pb-24 min-h-0">
                          <div className="flex flex-col items-center text-center">
                            <motion.div 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="w-48 h-72 rounded-[2.5rem] overflow-hidden shadow-2xl mb-8 border border-white/10"
                            >
                              <img src={`https://picsum.photos/seed/${s.coverSeed || s.id}/300/450`} className="w-full h-full object-cover" alt="Poster" />
                            </motion.div>
                            <h2 className="text-3xl font-black text-white uppercase mb-3 leading-tight tracking-tight">{s.title}</h2>
                            <div className="flex flex-wrap justify-center items-center gap-3 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                              <span className="px-2 py-1 bg-white/5 rounded-lg">{s.genre}</span>
                              <span>•</span>
                              <span className="px-2 py-1 bg-white/5 rounded-lg">{s.season}. Évad</span>
                              <span>•</span>
                              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg">★ {s.rating}</span>
                            </div>
                            {s.isCollaboration && (
                              <div className="mt-4 flex items-center gap-2 justify-center">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Kollaboráció:</span>
                                <span className="px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-500/20">{s.collaborator}</span>
                              </div>
                            )}
                          </div>

                          {/* Seasons Switcher */}
                          {(() => {
                            const seasons = seriesHistory.filter(x => x.title === s.title).sort((a, b) => a.season - b.season);
                            if (seasons.length <= 1) return null;
                            return (
                              <section>
                                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-4">Évadok</h4>
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                  {seasons.map(season => (
                                    <button
                                      key={season.id}
                                      onClick={() => setSelectedSeriesId(season.id)}
                                      className={`flex-shrink-0 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${selectedSeriesId === season.id ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}
                                    >
                                      {season.season}. Évad
                                    </button>
                                  ))}
                                </div>
                              </section>
                            );
                          })()}

                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-gradient-to-b from-white/10 to-transparent rounded-3xl p-4 border border-white/10 text-center">
                              <div className="text-xl font-black text-white">{(s.views / 1000).toFixed(1)}k</div>
                              <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">Néző</div>
                            </div>
                            <div className="bg-gradient-to-b from-white/10 to-transparent rounded-3xl p-4 border border-white/10 text-center">
                              <div className="text-xl font-black text-white">${(s.revenue / 1000).toFixed(0)}k</div>
                              <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">Bevétel</div>
                            </div>
                            <div className="bg-gradient-to-b from-white/10 to-transparent rounded-3xl p-4 border border-white/10 text-center">
                              <div className="text-xl font-black text-white">{s.quality}</div>
                              <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">Minőség</div>
                            </div>
                          </div>

                          <button 
                            onClick={() => releaseToCinema(s.id)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
                          >
                            <Tv className="w-4 h-4" /> MOZIPREMIER ($500k)
                          </button>

                          <section>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-4">Licencelés & Terjesztés</h4>
                            <div className="space-y-3">
                              {RIVAL_PLATFORMS.map(platform => {
                                const isOnPlatform = s.platforms?.includes(platform.name);
                                return (
                                  <div key={platform.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center text-[8px] font-black text-white uppercase`}>{platform.name.substring(0, 2)}</div>
                                      <div className="text-[10px] font-black text-white uppercase tracking-widest">{platform.name}</div>
                                    </div>
                                    {isOnPlatform ? (
                                      <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Szerződve</div>
                                    ) : (
                                      <button 
                                        onClick={() => {
                                          const fee = Math.floor((s.views * (s.rating / 10)) * 0.5);
                                          if (confirm(`Szerződés kötése a ${platform.name} platformmal?\nLicencdíj: $${fee.toLocaleString()}`)) {
                                            setMoney(prev => prev + fee);
                                            setSeriesHistory(prev => prev.map(x => x.id === s.id ? { ...x, platforms: [...(x.platforms || []), platform.name] } : x));
                                            setReputation(prev => Math.min(100, prev + 2));
                                            addTweet(platform.name, platform.id, `Hatalmas hír! A ${s.title} már elérhető a ${platform.name} kínálatában is! 🎬✨`, 2000, 500);
                                          }
                                        }}
                                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black text-white uppercase tracking-widest transition-colors"
                                      >
                                        Eladás
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </section>

                          <section>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Rajongói Vélemények</h4>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3 text-blue-400" />
                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Aktív</span>
                              </div>
                            </div>
                            <div className="space-y-4">
                              {s.comments.map(c => (
                                <motion.div 
                                  key={c.id} 
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="bg-white/5 rounded-[1.5rem] p-5 border border-white/5"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-[8px] font-black text-white uppercase">{c.user.substring(0, 1)}</div>
                                      <span className="text-[10px] font-black text-white uppercase tracking-wider">{c.user}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                                      <span className="text-[10px] font-black text-emerald-400">{c.rating.toFixed(1)}</span>
                                    </div>
                                  </div>
                                  <p className="text-xs text-white/70 leading-relaxed font-medium italic">"{c.text}"</p>
                                </motion.div>
                              ))}
                            </div>
                          </section>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            ) : phoneView === 'spotify' ? (
              <motion.div 
                key="spotify"
                initial={{ opacity: 0, x: 360 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 360 }}
                className="flex-1 flex flex-col bg-[#000] relative overflow-hidden h-full"
              >
                {/* Atmospheric Background */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1DB954]/40 via-transparent to-transparent blur-[100px]" />
                  <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-blue-500/20 via-transparent to-transparent blur-[100px]" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col h-full">
                  <div className="p-4 flex items-center justify-between bg-black/40 backdrop-blur-xl sticky top-0 z-30">
                    <button onClick={() => setPhoneView('home')} className="text-sm text-[#1DB954] font-bold">Vissza</button>
                    <span className="text-xs font-black uppercase tracking-widest text-white">Spotify</span>
                    <div className="w-10" />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10 pb-24 min-h-0">
                    <div className="relative h-48 rounded-3xl overflow-hidden shadow-2xl group">
                      <img 
                        src="https://picsum.photos/seed/music/400/400" 
                        className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                        alt="Music"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-2xl font-black text-white mb-1 leading-tight">Top Slágerek</h3>
                        <p className="text-xs text-white/60 font-medium">A hét legnépszerűbb dalai</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <section>
                        <h4 className="text-[11px] font-black text-[#1DB954] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <TrendingUp className="w-3 h-3" /> Globális Toplista
                        </h4>
                        <div className="space-y-3">
                          {(() => {
                            const allSongs = [
                              ...musicHistory.map(m => ({ id: m.id, title: m.title, artist: studioName, plays: m.plays, type: m.type, isPlayer: true })),
                              ...rivalSongs.map(s => ({ id: s.id, title: s.title, artist: s.artist, plays: s.plays, type: 'single', isPlayer: false }))
                            ].sort((a, b) => b.plays - a.plays).slice(0, 10);

                            return allSongs.map((song, index) => (
                              <div key={song.id} className={`flex items-center gap-4 group p-2 rounded-2xl transition-all ${song.isPlayer ? 'bg-[#1DB954]/10 border border-[#1DB954]/20' : 'hover:bg-white/5'}`}>
                                <div className="text-xs font-black text-white/40 w-4 text-center">{index + 1}.</div>
                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                                  <Play className={`w-4 h-4 ${song.isPlayer ? 'text-[#1DB954]' : 'text-white/40'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-bold truncate ${song.isPlayer ? 'text-[#1DB954]' : 'text-white'}`}>{song.title}</div>
                                  <div className="text-[10px] text-white/40 truncate font-medium">{song.artist}</div>
                                </div>
                                <div className="text-[10px] font-mono text-white/40 font-bold">
                                  {(song.plays / 1000).toFixed(1)}k
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </section>

                      <section>
                        <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">
                          {career === 'film' ? 'Saját Soundtrackek' : 'Saját Megjelenések'}
                        </h4>
                        <div className="space-y-4">
                          {career === 'film' ? (
                            songs.length === 0 ? (
                              <div className="text-center py-8 text-white/20 italic text-xs bg-white/5 rounded-2xl border border-white/5">
                                Még nem készült zene.
                              </div>
                            ) : (
                              songs.map((song) => (
                                <div key={song.id} className="flex items-center gap-4 group cursor-pointer">
                                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-[#1DB954]/20 transition-all group-active:scale-95">
                                    <Play className="w-5 h-5 text-[#1DB954] fill-current" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-white truncate group-hover:text-[#1DB954] transition-colors">{song.title}</div>
                                    <div className="text-[10px] text-white/40 truncate font-medium">{song.artist} • {song.seriesTitle}</div>
                                  </div>
                                  <div className="text-[10px] font-mono text-[#1DB954] font-bold">
                                    {(song.plays / 1000).toFixed(1)}k
                                  </div>
                                </div>
                              ))
                            )
                          ) : (
                            musicHistory.length === 0 ? (
                              <div className="text-center py-8 text-white/20 italic text-xs bg-white/5 rounded-2xl border border-white/5">
                                Még nem adtál ki zenét.
                              </div>
                            ) : (
                              musicHistory.map((release) => (
                                <div key={release.id} className="flex items-center gap-4 group cursor-pointer">
                                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-[#1DB954]/20 transition-all group-active:scale-95">
                                    <Play className="w-5 h-5 text-[#1DB954] fill-current" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-white truncate group-hover:text-[#1DB954] transition-colors">{release.title}</div>
                                    <div className="text-[10px] text-white/40 truncate font-medium">{release.type.toUpperCase()} • {release.genre}</div>
                                  </div>
                                  <div className="text-[10px] font-mono text-[#1DB954] font-bold">
                                    {(release.plays / 1000).toFixed(1)}k
                                  </div>
                                </div>
                              ))
                            )
                          )}
                        </div>
                      </section>

                      <section>
                        <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Rivális Albumok</h4>
                        <div className="space-y-4">
                          {rivalSongs.length === 0 ? (
                            <div className="text-center py-8 text-white/20 italic text-xs bg-white/5 rounded-2xl border border-white/5">
                              Nincsenek rivális dalok.
                            </div>
                          ) : (
                            rivalSongs.map((song) => (
                              <div key={song.id} className="flex items-center gap-4 group opacity-70 hover:opacity-100 transition-opacity">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                                  <Play className="w-5 h-5 text-white/40" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-bold text-white truncate">{song.title}</div>
                                  <div className="text-[10px] text-white/40 truncate font-medium">{song.artist} • {song.seriesTitle}</div>
                                </div>
                                <div className="text-[10px] font-mono text-white/40">
                                  {(song.plays / 1000).toFixed(1)}k
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="market"
                initial={{ opacity: 0, x: 360 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 360 }}
                className="flex-1 flex flex-col bg-[#0a0a0a]"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-md sticky top-0 z-30">
                  <button onClick={() => setPhoneView('home')} className="text-sm text-purple-500 font-bold">Vissza</button>
                  <span className="text-xs font-black uppercase tracking-widest">Piac</span>
                  <div className="w-10" />
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pb-24">
                  <div className="space-y-6">
                    {allPlatforms.map((platform) => (
                      <div key={platform.id} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className={platform.isPlayer ? "text-emerald-400" : "text-white uppercase tracking-wider"}>
                            {platform.name} {platform.isPlayer && "(Te)"}
                          </span>
                          <span className="font-mono">{platform.marketShare.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${platform.marketShare}%` }}
                            className={`h-full ${platform.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8">
                    <button 
                      onClick={nextDay}
                      className="w-full bg-white/10 text-white font-black py-4 rounded-2xl border border-white/10 active:scale-95 transition-transform flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
                    >
                      NAP ÁTUGRÁSA <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Home Indicator */}
          <div className="h-10 flex items-center justify-center">
            <button 
              onClick={() => setPhoneView('home')}
              className="w-28 h-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors active:scale-95" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function MusicCreatorForm({ 
  money, 
  onCreate 
}: { 
  money: number, 
  onCreate: (title: string, type: 'single' | 'album', genre: string, budget: number, coverSeed: string) => void 
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'single' | 'album'>('single');
  const [genre, setGenre] = useState<string>('Pop');
  const [budget, setBudget] = useState(50000);
  const [coverSeed, setCoverSeed] = useState('1');

  const budgetOptions = type === 'single' ? [10000, 25000, 50000, 100000] : [50000, 100000, 250000, 500000];
  const musicGenres = ['Pop', 'Hip-Hop', 'R&B', 'Rock', 'Electronic'];

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] p-6 space-y-8 overflow-y-auto pb-32 scrollbar-hide">
      <h2 className="text-xl font-black uppercase tracking-tighter">Új Zene Készítése</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Cím</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Dal vagy album címe..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Típus</label>
          <div className="grid grid-cols-2 gap-3">
            {(['single', 'album'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${type === t ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/5 border-white/10 text-white/40'}`}
              >
                {t === 'single' ? 'Single' : 'Album'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Műfaj</label>
          <div className="grid grid-cols-3 gap-2">
            {musicGenres.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${genre === g ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/40'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Borító</label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <button
                key={i}
                onClick={() => setCoverSeed(i.toString())}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${coverSeed === i.toString() ? 'border-emerald-500 scale-95' : 'border-transparent opacity-40 hover:opacity-100'}`}
              >
                <img 
                  src={`https://picsum.photos/seed/music_${genre}_${i}/100/100`} 
                  className="w-full h-full object-cover" 
                  alt="Cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Költségvetés</label>
          <div className="grid grid-cols-2 gap-2">
            {budgetOptions.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`py-3 rounded-xl text-xs font-mono border transition-all ${budget === b ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-white/5 border-white/10 text-white/40'}`}
              >
                ${b.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <button 
          onClick={() => onCreate(title, type, genre, budget, coverSeed)}
          disabled={money < budget || !title.trim()}
          className="w-full bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-500 text-black font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
        >
          {type === 'single' ? 'Dal Kiadása' : 'Album Kiadása'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SeriesCreatorForm({ 
  money, 
  history,
  studioName,
  initialSequelId,
  onCreate 
}: { 
  money: number, 
  history: Series[],
  studioName: string,
  initialSequelId?: string,
  onCreate: (title: string, genre: Genre, budget: number, studio: string, isSequelOf: string | undefined, coverSeed: string, artistId?: string, isCollaboration?: boolean, collaborator?: string) => void 
}) {
  const [activeTab, setActiveTab] = useState<'basic' | 'cover' | 'music' | 'collab'>('basic');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<Genre>('Dráma');
  const [budget, setBudget] = useState(100000);
  const [studio, setStudio] = useState(studioName);
  const [isSequel, setIsSequel] = useState<string | undefined>(initialSequelId);
  const [coverSeed, setCoverSeed] = useState('1');
  const [selectedArtist, setSelectedArtist] = useState<string | undefined>(undefined);
  const [isCollaboration, setIsCollaboration] = useState(false);
  const [collaborator, setCollaborator] = useState(STUDIOS[0]);

  useEffect(() => {
    setStudio(studioName);
  }, [studioName]);

  useEffect(() => {
    if (initialSequelId) {
      const s = history.find(x => x.id === initialSequelId);
      if (s) {
        setTitle(s.title);
        setGenre(s.genre);
        setIsSequel(s.id);
        setStudio(s.studio);
        setCoverSeed(s.coverSeed);
      }
    }
  }, [initialSequelId, history]);

  const budgetOptions = [100000, 250000, 500000, 1000000, 2000000];

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate(title, genre, budget, studio, isSequel, coverSeed, selectedArtist, isCollaboration, isCollaboration ? collaborator : undefined);
  };

  const availableSeries = history;

  const coverOptions = useMemo(() => {
    const keywords = GENRE_KEYWORDS[genre];
    return keywords.map((k, i) => `${k}_${i + 1}`);
  }, [genre]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] relative">
      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-30">
        {(['basic', 'cover', 'music', 'collab'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-500'}`}
          >
            {tab === 'basic' ? 'Alapadatok' : tab === 'cover' ? 'Borító' : tab === 'music' ? 'Zene' : 'Kollab'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide pb-32">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            {/* Sequel Toggle */}
            {availableSeries.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Típus</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      setIsSequel(undefined);
                    }}
                    className={`py-2 rounded-xl text-sm font-bold border transition-all ${!isSequel ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/10 text-gray-400'}`}
                  >
                    Új Sorozat
                  </button>
                  <button 
                    onClick={() => {
                      if (availableSeries.length > 0) {
                        const last = availableSeries[0];
                        setIsSequel(last.id);
                        setTitle(last.title);
                        setGenre(last.genre);
                        setStudio(last.studio);
                      }
                    }}
                    className={`py-2 rounded-xl text-sm font-bold border transition-all ${isSequel ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/10 text-gray-400'}`}
                  >
                    Folytatás
                  </button>
                </div>
              </div>
            )}

            {isSequel && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Melyik sorozat folytatása?</label>
                <select 
                  value={isSequel}
                  onChange={(e) => {
                    const s = availableSeries.find(x => x.id === e.target.value);
                    if (s) {
                      setIsSequel(s.id);
                      setTitle(s.title);
                      setGenre(s.genre);
                      setStudio(s.studio);
                    }
                  }}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-white"
                >
                  {availableSeries.map(s => (
                    <option key={s.id} value={s.id}>{s.title} (S{s.season + 1})</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cím</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pl. A sárkány háza..."
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-white"
              />
            </div>

            {!isSequel && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Stúdió / Brand</label>
                  <div className="grid grid-cols-3 gap-2">
                    {STUDIOS.map(s => {
                      const displayName = s === 'Saját Stúdió' ? studioName : s;
                      return (
                        <button 
                          key={s}
                          onClick={() => setStudio(displayName)}
                          className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${studio === displayName ? 'bg-blue-500 text-white border-blue-500' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                        >
                          {displayName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Műfaj</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GENRES.map(g => (
                      <button 
                        key={g}
                        onClick={() => setGenre(g)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${genre === g ? 'bg-white text-black border-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Költségvetés</label>
              <div className="grid grid-cols-3 gap-2">
                {budgetOptions.map(b => (
                  <button 
                    key={b}
                    disabled={money < b}
                    onClick={() => setBudget(b)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${budget === b ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/10 text-gray-400 hover:border-white/30'} ${money < b ? 'opacity-20 cursor-not-allowed' : ''}`}
                  >
                    ${(b / 1000).toLocaleString()}k
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cover' && (
          <div className="space-y-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Borító Választása</label>
            <div className="grid grid-cols-3 gap-3">
              {coverOptions.map((seed) => (
                <button 
                  key={seed}
                  onClick={() => setCoverSeed(seed)}
                  className={`aspect-[2/3] rounded-2xl overflow-hidden border-4 transition-all ${coverSeed === seed ? 'border-emerald-500 scale-105 shadow-2xl' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                >
                  <img 
                    src={`https://picsum.photos/seed/${seed}/200/300`} 
                    className="w-full h-full object-cover" 
                    alt="Option"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'music' && (
          <div className="space-y-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Soundtrack Előadó</label>
            <p className="text-[10px] text-gray-500 mb-4">Kérj fel egy előadót, hogy énekelje el a főcímdalt!</p>
            <div className="space-y-3">
              <button 
                onClick={() => setSelectedArtist(undefined)}
                className={`w-full p-4 rounded-2xl text-xs font-bold border transition-all text-left flex items-center justify-between ${!selectedArtist ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'border-white/5 text-gray-500'}`}
              >
                <span>Nincs zene</span>
                {!selectedArtist && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
              </button>
              {MUSIC_ARTISTS.map(artist => (
                <button 
                  key={artist.id}
                  disabled={money < artist.fee}
                  onClick={() => setSelectedArtist(artist.id)}
                  className={`w-full p-4 rounded-2xl text-xs font-bold border transition-all text-left flex items-center justify-between ${selectedArtist === artist.id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'border-white/5 text-gray-400'} ${money < artist.fee ? 'opacity-20 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-lg">🎵</div>
                    <div>
                      <div className="text-sm">{artist.name}</div>
                      <div className="text-[10px] opacity-60">{artist.genre} • Díj: ${artist.fee.toLocaleString()}</div>
                    </div>
                  </div>
                  {selectedArtist === artist.id && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
                </button>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'collab' && (
          <div className="space-y-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Kollaboráció</label>
            <p className="text-[10px] text-gray-500 mb-4">Dolgozz együtt egy másik stúdióval! Ők fizetik a költségek felét, de a bevételt is megosztjátok.</p>
            
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button 
                onClick={() => setIsCollaboration(false)}
                className={`py-3 rounded-xl text-sm font-bold border transition-all ${!isCollaboration ? 'bg-white text-black border-white' : 'border-white/10 text-gray-400'}`}
              >
                Saját Gyártás
              </button>
              <button 
                onClick={() => setIsCollaboration(true)}
                className={`py-3 rounded-xl text-sm font-bold border transition-all ${isCollaboration ? 'bg-white text-black border-white' : 'border-white/10 text-gray-400'}`}
              >
                Közös Munka
              </button>
            </div>

            {isCollaboration && (
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Válassz Partnert</label>
                <div className="grid grid-cols-2 gap-2">
                  {STUDIOS.filter(s => s !== 'Saját Stúdió').map(s => (
                    <button 
                      key={s}
                      onClick={() => setCollaborator(s)}
                      className={`p-3 rounded-xl text-[10px] font-bold border transition-all ${collaborator === s ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'border-white/10 text-gray-400'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent pt-12 z-20 pointer-events-none">
        <button 
          onClick={handleCreate}
          disabled={!title.trim() || money < budget}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-5 rounded-3xl transition-all shadow-2xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-3 pointer-events-auto"
        >
          {isSequel ? 'FILM SEASON' : 'START SERIES'} <Play className="w-6 h-6 fill-current" />
        </button>
      </div>
    </div>
  );
}

interface YouTubeViewProps {
  career: 'film' | 'music';
  money: number;
  seriesHistory: Series[];
  musicHistory: MusicRelease[];
  setMoney: React.Dispatch<React.SetStateAction<number>>;
  setFans: React.Dispatch<React.SetStateAction<number>>;
  setReputation: React.Dispatch<React.SetStateAction<number>>;
  setSeriesHistory: React.Dispatch<React.SetStateAction<Series[]>>;
  setMusicHistory: React.Dispatch<React.SetStateAction<MusicRelease[]>>;
  addTweet: (author: string, type: string, content: string, likes: number, retweets: number) => void;
  studioName: string;
  onBack: () => void;
}

const YouTubeView: React.FC<YouTubeViewProps> = ({ 
  career, money, seriesHistory, musicHistory, setMoney, setFans, setReputation, setSeriesHistory, setMusicHistory, addTweet, studioName, onBack 
}) => {
  const [selectedUploadType, setSelectedUploadType] = useState<'video' | 'lyrics' | 'image'>('video');

  const uploadOptions = [
    { id: 'video', name: 'Music Video', cost: 100000, impact: 1.0, icon: <Video className="w-4 h-4" /> },
    { id: 'lyrics', name: 'Lyrics Video', cost: 25000, impact: 0.4, icon: <Type className="w-4 h-4" /> },
    { id: 'image', name: 'Static Image', cost: 5000, impact: 0.1, icon: <Image className="w-4 h-4" /> },
  ];

  return (
    <motion.div 
      key="youtube"
      initial={{ opacity: 0, x: 360 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 360 }}
      className="flex-1 flex flex-col bg-[#0f0f0f]"
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0f0f0f]/80 backdrop-blur-md sticky top-0 z-30">
        <button onClick={onBack} className="text-sm text-red-600 font-bold">Back</button>
        <div className="flex items-center gap-2">
          <Youtube className="w-5 h-5 text-red-600 fill-current" />
          <span className="text-xs font-black uppercase tracking-widest text-white">YouTube Studio</span>
        </div>
        <div className="w-10" />
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pb-24">
        <div className="bg-red-600/10 rounded-3xl p-6 border border-red-600/20 text-center">
          <Play className="w-12 h-12 text-red-600 mx-auto mb-4 fill-current" />
          <h2 className="text-xl font-black text-white uppercase mb-2">
            {career === 'film' ? 'Release Trailer' : 'Upload Content'}
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            {career === 'film' 
              ? 'A well-made trailer can generate massive hype!' 
              : 'Choose how you want to present your music to the world.'}
          </p>
        </div>

        {career === 'music' && (
          <div className="grid grid-cols-3 gap-2">
            {uploadOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSelectedUploadType(opt.id as any)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                  selectedUploadType === opt.id 
                    ? 'bg-red-600 border-red-600 text-white' 
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                {opt.icon}
                <span className="text-[8px] font-black uppercase tracking-tighter">{opt.name}</span>
                <span className="text-[8px] opacity-60">${(opt.cost/1000).toFixed(0)}k</span>
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            {career === 'film' ? 'Select Series' : 'Select Music'}
          </h3>
          {career === 'film' ? (
            seriesHistory.length === 0 ? (
              <div className="text-center py-8 text-white/20 italic text-xs bg-white/5 rounded-2xl border border-white/5">
                No series released yet.
              </div>
            ) : (
              <div className="space-y-3">
                {seriesHistory.map(s => (
                  <div key={s.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10">
                        <img src={`https://picsum.photos/seed/${s.coverSeed || s.id}/100/100`} className="w-full h-full object-cover" alt="Cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white uppercase">{s.title}</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase">{s.genre} • S{s.season}</div>
                      </div>
                    </div>
                    {s.hasTrailer ? (
                      <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[8px] font-black uppercase tracking-widest">Released</div>
                    ) : (
                      <button 
                        onClick={() => {
                          if (money < 50000) {
                            alert("Not enough money! ($50,000 required)");
                            return;
                          }
                          setMoney(prev => prev - 50000);
                          setFans(prev => prev + 10000 + Math.floor(Math.random() * 20000));
                          setReputation(prev => Math.min(100, prev + 5));
                          setSeriesHistory(prev => prev.map(x => x.id === s.id ? { ...x, hasTrailer: true } : x));
                          
                          const trailerLink = `youtu.be/${s.id.substring(0, 8)}`;
                          addTweet(studioName, "player", `Finally, the trailer for the new season of ${s.title} is here! 🎬🔥 ${trailerLink}`, 15000, 3000);
                          alert(`Trailer released! Link: ${trailerLink}`);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
                      >
                        Release ($50k)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            musicHistory.length === 0 ? (
              <div className="text-center py-8 text-white/20 italic text-xs bg-white/5 rounded-2xl border border-white/5">
                No music released yet.
              </div>
            ) : (
              <div className="space-y-3">
                {musicHistory.map(m => (
                  <div key={m.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10">
                        <img src={`https://picsum.photos/seed/music_${m.genre}_${m.coverSeed}/100/100`} className="w-full h-full object-cover" alt="Cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white uppercase">{m.title}</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase">{m.genre} • {m.type.toUpperCase()}</div>
                      </div>
                    </div>
                    {m.hasVideo ? (
                      <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[8px] font-black uppercase tracking-widest">Uploaded</div>
                    ) : (
                      <button 
                        onClick={() => {
                          const opt = uploadOptions.find(o => o.id === selectedUploadType)!;
                          if (money < opt.cost) {
                            alert(`Not enough money! ($${opt.cost.toLocaleString()} required)`);
                            return;
                          }
                          setMoney(prev => prev - opt.cost);
                          
                          // Impact calculation
                          const basePlays = m.plays;
                          const extraPlays = Math.floor(basePlays * (0.2 + Math.random() * 0.8) * opt.impact);
                          const extraFans = Math.floor(extraPlays * 0.1);
                          
                          setMusicHistory(prev => prev.map(x => x.id === m.id ? { ...x, hasVideo: true, plays: x.plays + extraPlays } : x));
                          setFans(prev => prev + extraFans);
                          setReputation(prev => Math.min(100, prev + (opt.impact * 10)));
                          
                          const videoLink = `youtu.be/${m.id.substring(0, 8)}`;
                          addTweet(studioName, "player", `Check out my new ${opt.name} for "${m.title}"! 🎵🔥 ${videoLink} #music #newrelease`, 25000, 6000);
                          alert(`${opt.name} uploaded! +${extraPlays.toLocaleString()} extra plays and +${extraFans.toLocaleString()} new fans!`);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
                      >
                        Upload (${(uploadOptions.find(o => o.id === selectedUploadType)!.cost/1000).toFixed(0)}k)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};
