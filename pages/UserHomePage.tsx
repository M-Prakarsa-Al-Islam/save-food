import React, { useState, useContext } from 'react';
import type { FoodItem, Reservation } from '../types';
import UserDashboard from '../components/user/UserDashboard';
import FoodDetail from '../components/user/FoodDetail';
import ReservationConfirmation from '../components/user/ReservationConfirmation';
import { DataContext } from '../context/DataContext';
// FIX: Corrected the import path for LanguageContext.
import { LanguageContext } from '../context/ThemeContext';
import BottomNav from '../components/BottomNav';
import UserReservationsPage from './UserReservationsPage';
import UserProfilePage from './UserProfilePage';
import UserWishlistPage from './UserWishlistPage';


export type UserView = 'home' | 'reservations';

const UserHomePage: React.FC = () => {
  const [view, setView] = useState<UserView>('home');
  const [profileView, setProfileView] = useState<'main' | 'wishlist' | null>(null);
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const dataContext = useContext(DataContext);
  const { t } = useContext(LanguageContext)!;

  const handleReserve = (foodItem: FoodItem) => {
    if (dataContext) {
      try {
        const reservation = dataContext.createReservation(foodItem.id);
        setActiveReservation(reservation);
      } catch (e: any)
      {
        alert(t(e.message));
      }
    }
  };

  const handleCloseConfirmation = () => {
    setActiveReservation(null);
    setSelectedFoodItem(null); // Go back to dashboard after reservation
    setView('reservations'); // Switch to reservations tab to see new reservation
  };
  
  const handleProfileClick = () => {
      setSelectedFoodItem(null); // ensure food detail is closed
      setProfileView('main');
  };
  
  const handleProfileBack = () => {
      setProfileView(null);
  }

  const renderContent = () => {
    if (selectedFoodItem) {
      return <FoodDetail foodItem={selectedFoodItem} onBack={() => setSelectedFoodItem(null)} onReserve={handleReserve} />;
    }
    
    if (profileView === 'main') {
        return <UserProfilePage onBack={handleProfileBack} onNavigateToWishlist={() => setProfileView('wishlist')} />;
    }

    if (profileView === 'wishlist') {
        return <UserWishlistPage onSelectFoodItem={setSelectedFoodItem} onBack={() => setProfileView('main')} />;
    }
    
    switch(view) {
        case 'home':
            return <UserDashboard onSelectFoodItem={setSelectedFoodItem} onProfileClick={handleProfileClick} />;
        case 'reservations':
            return <UserReservationsPage onSelectFoodItem={setSelectedFoodItem} onProfileClick={handleProfileClick}/>;
        default:
            return <UserDashboard onSelectFoodItem={setSelectedFoodItem} onProfileClick={handleProfileClick} />;
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen">
      <main className="pb-20">
        {renderContent()}
      </main>
      
      {!selectedFoodItem && !profileView && <BottomNav activeTab={view} onTabChange={setView} />}

      {activeReservation && selectedFoodItem && (
        <ReservationConfirmation 
          reservation={activeReservation} 
          foodItem={selectedFoodItem}
          onClose={handleCloseConfirmation}
        />
      )}
    </div>
  );
};

export default UserHomePage;