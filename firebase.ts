
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

/**
 * Firebase 配置
 */
const firebaseConfig = {
  apiKey: "AIzaSyBwlKETZ97CNxuDeq-8vfDP7LiZHhNPdRs",
  authDomain: "mobile-monster-4a17a.firebaseapp.com",
  databaseURL: "https://mobile-monster-4a17a-default-rtdb.firebaseio.com",
  projectId: "mobile-monster-4a17a",
  storageBucket: "mobile-monster-4a17a.firebasestorage.app",
  messagingSenderId: "91346929391",
  appId: "1:91346929391:web:a142e839db7ca795fc7d1a",
  measurementId: "G-N0E3MS5PV2"
};

// 確保 App 實例在全局唯一且正確初始化
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 獲取與該 App 實例綁定的服務
export const db = getDatabase(app, firebaseConfig.databaseURL);
export const auth = getAuth(app);

// Analytics 標記為 null 以簡化模組依賴
export const analytics = null;
