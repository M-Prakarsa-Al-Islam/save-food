import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
// FIX: Corrected the import path for LanguageContext.
import { LanguageContext } from '../context/ThemeContext';
import Header from '../components/Header';
import PartnerDashboard from '../components/partner/PartnerDashboard';
// FIX: Corrected the import path for PostFoodForm.
import PostFoodForm from '../components/partner/PostFoodForm';
// FIX: Corrected the import path for ManageReservations.
import ManageReservations from '../components/partner/ManageReservations';
import PartnerAnalytics from '../components/partner/PartnerAnalytics';
import PartnerProfilePage from './PartnerProfilePage';

type PartnerView = 'dashboard' | 'post' | 'reservations' | 'analytics' | 'profile';

const PartnerHomePage: React.FC = () => {
  const [view, setView] = useState<PartnerView>('dashboard');
  const dataContext = useContext(DataContext);
  const authContext = useContext(AuthContext);
  const { t } = useContext(LanguageContext)!;
  const { currentUser } = authContext!;
  
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
  };

  const handlePostFood = async (formData: any) => {
    if(dataContext && currentUser){
        let imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=880&auto=format&fit=crop'; // Default image
        if (formData.image) {
            try {
                imageUrl = await fileToDataUrl(formData.image);
            } catch (error) {
                console.error("Error converting image to data URL", error);
                // Keep default image on error
            }
        }
        
        const finalData = { 
            ...formData, 
            imageUrl,
            pickupAddress: formData.address
        };
        delete finalData.image; // remove original file object
        delete finalData.address; // remove original address property

        dataContext.addFoodItem(finalData);
        alert(t('alert.foodPostedSuccess'));
        setView('dashboard');
    }
  };
  
  const handleBackToDashboard = () => setView('dashboard');

  const renderContent = () => {
    switch(view) {
      case 'post':
        return <PostFoodForm 
                    onBack={handleBackToDashboard} 
                    onPost={handlePostFood} 
                    initialAddress={(currentUser as any)?.address || ''}
                    initialLat={(currentUser as any)?.lat || -6.20}
                    initialLng={(currentUser as any)?.lng || 106.81}
                />;
      case 'reservations':
        return <ManageReservations onBack={handleBackToDashboard} />;
      case 'analytics':
        return <PartnerAnalytics onBack={handleBackToDashboard} />;
      case 'profile':
        return <PartnerProfilePage onBack={handleBackToDashboard} />;
      case 'dashboard':
      default:
        return <PartnerDashboard onNavigate={setView} />;
    }
  };
  
  return (
    <div className="bg-light dark:bg-dark min-h-screen">
      <Header title={t('partnerDashboard')} variant="primary" onProfileClick={() => setView('profile')} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default PartnerHomePage;