import React, { createContext, useState, useEffect, useCallback } from 'react';

// --- TRANSLATIONS ---
const translations: { [key: string]: { [key: string]: string | any } } = {
  en: {
    savefood: 'SaveFood',
    welcome: 'Hello, {{name}}!',
    welcomeSubtitle: 'Ready to save some delicious food today?',
    searchPlaceholder: 'Search for food or restaurants...',
    dontMissOut: "Don't Miss Out!",
    allFood: 'All Food',
    free: 'Free',
    freeTag: 'FREE',
    rp: 'Rp',
    stock: 'Stock',
    portions: 'Portions',
    remaining: 'Remaining',
    timeLeft: 'Time Left',
    expired: 'Expired',
    description: 'Description',
    price: 'Price',
    pickupLocation: 'Pickup Location',
    reserveNow: 'Reserve Now',
    reservationSuccessTitle: 'Reservation Successful!',
    reservationSuccessBody: 'Your food is waiting for you. Show the QR code or reservation code at the store to pick it up.',
    saveQrCode: 'Save QR Code',
    orShowCode: 'Or show this code to the cashier',
    orderDetails: 'Order Details',
    at: 'at',
    done: 'Done',
    partnerDashboard: 'Partner Dashboard',
    postNewFood: 'Post New Food',
    postNewFoodDesc: 'Share your surplus food and prevent waste.',
    manageReservations: 'Manage Reservations',
    manageReservationsDesc: 'View and confirm incoming food reservations.',
    reportsAnalytics: 'Reports & Analytics',
    reportsAnalyticsDesc: 'Track your impact and see your saved meals.',
    myReservationsTitle: 'My Reservations',
    activeReservations: 'Active Reservations',
    noActiveReservations: 'No active reservations',
    goSaveFood: 'Go save some food!',
    history: 'History',
    incompleteReservationInfo: 'Incomplete Reservation Info',
    incompleteReservationInfoDesc: 'This item or restaurant may no longer be available.',
    completed: 'Completed',
    active: 'Active',
    date: 'Date',
    codeLabel: 'Code',
    historyWillAppearHere: 'Your past reservations will appear here.',
    myProfile: 'My Profile',
    foodSaver: 'Food Saver',
    email: 'Email',
    phoneNumber: 'Phone Number',
    deleteProfile: 'Delete Profile',
    logout: 'Logout',
    editProfile: 'Edit Profile',
    fullName: 'Full Name',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    deleteProfileTitle: 'Delete Account',
    deleteProfileBody: 'Are you sure? This action is irreversible. All your data will be permanently deleted.',
    confirmDelete: 'Yes, Delete',
    "alert.profileUpdatedSuccess": "Profile updated successfully!",
    "alert.foodPostedSuccess": "Food posted successfully!",
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    landingSubtitle: 'Rescue delicious unsold food from your favorite stores.',
    loginOrRegister: 'Continue as...',
    iAmAUser: 'I am a User',
    userDescription: 'Find and rescue surplus food near you.',
    iAmAPartner: 'I am a Partner',
    partnerDescription: 'Join the movement, reduce waste, and gain customers.',
    login: 'Login',
    register: 'Register',
    back: 'Back',
    name: 'Name',
    restaurantName: 'Restaurant Name',
    emailAddress: 'Email Address',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    passwordMinChars: 'Password must be at least 5 characters.',
    passwordOneUppercase: 'Password must contain one uppercase letter.',
    passwordOneLowercase: 'Password must contain one lowercase letter.',
    passwordOneNumber: 'Password must contain one number.',
    phoneInvalid: 'Phone number must be +62 followed by 11 digits.',
    emailOrPasswordWrong: 'Incorrect email or password.',
    emailTaken: 'This email is already registered.',
    forgotPasswordTitle: 'Feature Not Available',
    forgotPasswordBody: 'This is a demo application.\nPassword recovery is not implemented. Please use the credentials you registered with or create a new account.',
    iUnderstand: 'I Understand',
    noFoodFoundTitle: 'No Food Found',
    noFoodFoundSubtitle: 'Try adjusting your search or category filters.',
    surpriseMealTitle: 'This is a Surprise Meal!',
    surpriseMealBody: "The contents are a surprise, but it's guaranteed to be delicious. You'll get a mix of available items from the partner.",
    "error.onlyUsersCanReserve": "Only users can make reservations.",
    "error.foodUnavailable": "This food is no longer available.",
    "error.foodExpired": "This food has already expired.",
    "error.onlyPartnersCanPost": "Only partners can post food items.",
    "error.invalidReservationCode": "Invalid or already completed reservation code.",
    partnerDashboardTitle: 'Welcome to your Dashboard',
    reportsAnalyticsTitle: 'Reports & Analytics',
    portionsSaved: 'Portions Saved',
    portionsSavedDesc: 'Total meals rescued by customers.',
    yourRewardPoints: 'Your Reward Points',
    rewardPointsDesc: 'Points earned from your contributions.',
    transactionHistory: 'Transaction History',
    by: 'by',
    noTransactionHistory: 'No transactions have been completed yet.',
    partnerProfile: 'Partner Profile',
    contactNumber: 'Contact Number',
    address: 'Address',
    restaurantType: 'Restaurant Type',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    heavyMeal: 'Heavy Meal',
    bread: 'Bread',
    beverage: 'Beverage',
    cake: 'Cake',
    other: 'Other',
    foodImage: 'Food Image',
    uploadAFile: 'Upload a file',
    orDragAndDrop: 'or drag and drop',
    imageFileTypes: 'PNG, JPG, GIF up to 10MB',
    isSurpriseMeal: 'Surprise Meal',
    surpriseMealInfo: 'Automatically enabled if price is 0.',
    foodName: 'Food Name',
    generateWithAI: 'Generate with AI',
    generating: 'Generating...',
    openMap: 'Open Map',
    // FIX: Merged duplicate 'category' keys into a single object.
    category: { '_': 'Category', all: 'All' },
    expiresIn: 'Expires In',
    minutes: 'minutes',
    hour: 'hour',
    hours: 'hours',
    days: 'days',
    custom: 'Custom',
    customTime: 'Custom Expiry Time',
    originalPrice: 'Original Price (Rp)',
    discountedPrice: 'Discounted Price (Rp)',
    pickupAddress: 'Pickup Address',
    useCurrentAddress: 'Use profile address',
    postFood: 'Post Food',
    "alert.enterFoodName": 'Please enter a food name first to generate a description.',
    "alert.geminiError": 'Failed to generate description. Please write one manually.',
    "alert.selectCustomTime": "Please select a custom expiration time.",
    reservationDate: 'Reservation Date',
    verifyReservation: 'Verify Reservation',
    enterCode: 'Enter reservation code...',
    verify: 'Verify',
    searchReservations: 'Search by code, food, or user name...',
    noActiveReservationsFound: 'No Active Reservations Found',
    tryDifferentSearch: 'Try a different search term.',
    newReservationsAppearHere: 'New reservations will appear here.',
    "alert.verificationSuccess": 'Reservation completed successfully!',
    "alert.verificationError": 'Verification failed. Please check the code and try again.',
    home: 'Home',
    cart: 'Cart',
    wishlist: 'Wishlist',
    myWishlistTitle: 'My Wishlist',
    wishlistEmptyTitle: 'Your wishlist is empty',
    wishlistEmptySubtitle: 'Tap the heart on any food item to save it here.',
    pickupLocationOnMap: 'Pickup Location on Map',
    findOnMapInstructions: 'Right-click on Google Maps to get coordinates and paste them here. Open map <a href="{{url}}" target="_blank" rel="noopener noreferrer" class="text-primary underline">here</a>.',
  },
  id: {
    savefood: 'SaveFood',
    welcome: 'Halo, {{name}}!',
    welcomeSubtitle: 'Siap menyelamatkan makanan lezat hari ini?',
    searchPlaceholder: 'Cari makanan atau restoran...',
    dontMissOut: 'Jangan Sampai Ketinggalan!',
    allFood: 'Semua Makanan',
    free: 'Gratis',
    freeTag: 'GRATIS',
    rp: 'Rp',
    stock: 'Stok',
    portions: 'Porsi',
    remaining: 'Tersisa',
    timeLeft: 'Sisa Waktu',
    expired: 'Kedaluwarsa',
    description: 'Deskripsi',
    price: 'Harga',
    pickupLocation: 'Lokasi Pengambilan',
    reserveNow: 'Pesan Sekarang',
    reservationSuccessTitle: 'Reservasi Berhasil!',
    reservationSuccessBody: 'Makananmu sudah menanti. Tunjukkan kode QR atau kode reservasi di toko untuk mengambilnya.',
    saveQrCode: 'Simpan Kode QR',
    orShowCode: 'Atau tunjukkan kode ini ke kasir',
    orderDetails: 'Detail Pesanan',
    at: 'di',
    done: 'Selesai',
    partnerDashboard: 'Dasbor Mitra',
    postNewFood: 'Posting Makanan Baru',
    postNewFoodDesc: 'Bagikan makanan berlebih Anda dan cegah pemborosan.',
    manageReservations: 'Kelola Reservasi',
    manageReservationsDesc: 'Lihat dan konfirmasi reservasi makanan yang masuk.',
    reportsAnalytics: 'Laporan & Analitik',
    reportsAnalyticsDesc: 'Lacak dampak Anda dan lihat makanan yang terselamatkan.',
    myReservationsTitle: 'Reservasi Saya',
    activeReservations: 'Reservasi Aktif',
    noActiveReservations: 'Tidak ada reservasi aktif',
    goSaveFood: 'Ayo selamatkan makanan!',
    history: 'Riwayat',
    incompleteReservationInfo: 'Info Reservasi Tidak Lengkap',
    incompleteReservationInfoDesc: 'Item atau restoran ini mungkin tidak lagi tersedia.',
    completed: 'Selesai',
    active: 'Aktif',
    date: 'Tanggal',
    codeLabel: 'Kode',
    historyWillAppearHere: 'Riwayat reservasi Anda akan muncul di sini.',
    myProfile: 'Profil Saya',
    foodSaver: 'Penyelamat Makanan',
    email: 'Email',
    phoneNumber: 'Nomor Telepon',
    deleteProfile: 'Hapus Akun',
    logout: 'Keluar',
    editProfile: 'Ubah Profil',
    fullName: 'Nama Lengkap',
    saveChanges: 'Simpan Perubahan',
    cancel: 'Batal',
    deleteProfileTitle: 'Hapus Akun',
    deleteProfileBody: 'Apakah Anda yakin? Tindakan ini tidak dapat diurungkan. Semua data Anda akan dihapus secara permanen.',
    confirmDelete: 'Ya, Hapus',
    "alert.profileUpdatedSuccess": "Profil berhasil diperbarui!",
    "alert.foodPostedSuccess": "Makanan berhasil diposting!",
    darkMode: 'Mode Gelap',
    lightMode: 'Mode Terang',
    language: 'Bahasa',
    landingSubtitle: 'Selamatkan makanan lezat yang tidak terjual dari toko favorit Anda.',
    loginOrRegister: 'Masuk sebagai...',
    iAmAUser: 'Saya Pengguna',
    userDescription: 'Temukan dan selamatkan makanan berlebih di dekat Anda.',
    iAmAPartner: 'Saya Mitra',
    partnerDescription: 'Bergabunglah, kurangi limbah, dan dapatkan pelanggan.',
    login: 'Masuk',
    register: 'Daftar',
    back: 'Kembali',
    name: 'Nama',
    restaurantName: 'Nama Restoran',
    emailAddress: 'Alamat Email',
    password: 'Kata Sandi',
    forgotPassword: 'Lupa kata sandi?',
    passwordMinChars: 'Kata sandi minimal 5 karakter.',
    passwordOneUppercase: 'Kata sandi harus mengandung satu huruf besar.',
    passwordOneLowercase: 'Kata sandi harus mengandung satu huruf kecil.',
    passwordOneNumber: 'Kata sandi harus mengandung satu angka.',
    phoneInvalid: 'Nomor telepon harus +62 diikuti 11 digit.',
    emailOrPasswordWrong: 'Email atau kata sandi salah.',
    emailTaken: 'Email ini sudah terdaftar.',
    forgotPasswordTitle: 'Fitur Tidak Tersedia',
    forgotPasswordBody: 'Ini adalah aplikasi demo.\nPemulihan kata sandi tidak diimplementasikan. Silakan gunakan kredensial yang Anda daftarkan atau buat akun baru.',
    iUnderstand: 'Saya Mengerti',
    noFoodFoundTitle: 'Makanan Tidak Ditemukan',
    noFoodFoundSubtitle: 'Coba sesuaikan pencarian atau filter kategori Anda.',
    surpriseMealTitle: 'Ini adalah Makanan Kejutan!',
    surpriseMealBody: "Isinya adalah kejutan, tapi dijamin enak. Anda akan mendapatkan campuran item yang tersedia dari mitra.",
    "error.onlyUsersCanReserve": "Hanya pengguna yang dapat melakukan reservasi.",
    "error.foodUnavailable": "Makanan ini sudah tidak tersedia.",
    "error.foodExpired": "Makanan ini sudah kedaluwarsa.",
    "error.onlyPartnersCanPost": "Hanya mitra yang dapat memposting makanan.",
    "error.invalidReservationCode": "Kode reservasi tidak valid atau sudah selesai.",
    partnerDashboardTitle: 'Selamat Datang di Dasbor Anda',
    reportsAnalyticsTitle: 'Laporan & Analitik',
    portionsSaved: 'Porsi Terselamatkan',
    portionsSavedDesc: 'Total makanan yang diselamatkan oleh pelanggan.',
    yourRewardPoints: 'Poin Hadiah Anda',
    rewardPointsDesc: 'Poin yang diperoleh dari kontribusi Anda.',
    transactionHistory: 'Riwayat Transaksi',
    by: 'oleh',
    noTransactionHistory: 'Belum ada transaksi yang selesai.',
    partnerProfile: 'Profil Mitra',
    contactNumber: 'Nomor Kontak',
    address: 'Alamat',
    restaurantType: 'Jenis Restoran',
    showPassword: 'Tampilkan kata sandi',
    hidePassword: 'Sembunyikan kata sandi',
    heavyMeal: 'Makanan Berat',
    bread: 'Roti',
    beverage: 'Minuman',
    cake: 'Kue',
    other: 'Lainnya',
    foodImage: 'Gambar Makanan',
    uploadAFile: 'Unggah file',
    orDragAndDrop: 'atau seret dan lepas',
    imageFileTypes: 'PNG, JPG, GIF hingga 10MB',
    isSurpriseMeal: 'Makanan Kejutan',
    surpriseMealInfo: 'Otomatis aktif jika harga Rp 0.',
    foodName: 'Nama Makanan',
    generateWithAI: 'Buat dengan AI',
    generating: 'Membuat...',
    openMap: 'Buka Peta',
    // FIX: Merged duplicate 'category' keys into a single object.
    category: { '_': 'Kategori', all: 'Semua' },
    expiresIn: 'Kedaluwarsa Dalam',
    minutes: 'menit',
    hour: 'jam',
    hours: 'jam',
    days: 'hari',
    custom: 'Kustom',
    customTime: 'Waktu Kedaluwarsa Kustom',
    originalPrice: 'Harga Asli (Rp)',
    discountedPrice: 'Harga Diskon (Rp)',
    pickupAddress: 'Alamat Pengambilan',
    useCurrentAddress: 'Gunakan alamat profil',
    postFood: 'Posting Makanan',
    "alert.enterFoodName": 'Silakan masukkan nama makanan terlebih dahulu untuk membuat deskripsi.',
    "alert.geminiError": 'Gagal membuat deskripsi. Silakan tulis manual.',
    "alert.selectCustomTime": "Silakan pilih waktu kedaluwarsa kustom.",
    reservationDate: 'Tanggal Reservasi',
    verifyReservation: 'Verifikasi Reservasi',
    enterCode: 'Masukkan kode reservasi...',
    verify: 'Verifikasi',
    searchReservations: 'Cari berdasarkan kode, makanan, atau nama...',
    noActiveReservationsFound: 'Tidak Ada Reservasi Aktif',
    tryDifferentSearch: 'Coba kata kunci pencarian yang berbeda.',
    newReservationsAppearHere: 'Reservasi baru akan muncul di sini.',
    "alert.verificationSuccess": 'Reservasi berhasil diselesaikan!',
    "alert.verificationError": 'Verifikasi gagal. Periksa kembali kode dan coba lagi.',
    home: 'Beranda',
    cart: 'Keranjang',
    wishlist: 'Daftar Suka',
    myWishlistTitle: 'Daftar Suka Saya',
    wishlistEmptyTitle: 'Daftar suka Anda kosong',
    wishlistEmptySubtitle: 'Ketuk ikon hati pada makanan mana pun untuk menyimpannya di sini.',
    pickupLocationOnMap: 'Lokasi Pengambilan di Peta',
    findOnMapInstructions: 'Klik kanan di Google Maps untuk mendapatkan koordinat dan salin di sini. Buka peta <a href="{{url}}" target="_blank" rel="noopener noreferrer" class="text-primary underline">di sini</a>.',
  },
};


// --- THEME CONTEXT ---
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('savefood_theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('savefood_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    {/* FIX: Corrected the closing tag from Theme.Provider to ThemeContext.Provider */}
    </ThemeContext.Provider>
  );
};


// --- LANGUAGE CONTEXT ---
type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('id');

    useEffect(() => {
        const storedLang = localStorage.getItem('savefood_lang') as Language | null;
        if (storedLang) {
            setLanguage(storedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('savefood_lang', lang);
    };
    
    // FIX: Updated 't' function to handle nested objects with a default '_' key.
    const t = useCallback((key: string, options?: { [key: string]: string | number }) => {
        let translation = translations[language];
        const keyParts = key.split('.');
        let text: any = translation;

        for (const part of keyParts) {
            if (text && typeof text === 'object' && part in text) {
                text = text[part];
            } else {
                // Fallback to English if key not found in current language
                text = keyParts.reduce((acc: any, p) => acc && acc[p], translations['en']);
                if (text === undefined) return key; // return key if not found in English either
                break;
            }
        }
        
        // If the resolved value is an object (namespace), check for a default value.
        if (typeof text === 'object' && text !== null && '_' in text) {
            text = text['_'];
        }

        if (typeof text !== 'string') {
            return key;
        }

        if (options) {
            Object.keys(options).forEach(optKey => {
                text = text.replace(`{{${optKey}}}`, String(options[optKey]));
            });
        }
        
        return text;
    }, [language]);


    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};