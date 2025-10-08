import React, { useContext, useMemo } from 'react';
import { ChevronLeft, Package, Clock, Tag, Inbox } from 'lucide-react';
import { DataContext } from '../../context/DataContext';
import { AuthContext } from '../../context/AuthContext';
import { LanguageContext } from '../../context/ThemeContext';
import type { FoodItem } from '../../types';
import CountdownTimer from '../CountdownTimer';

interface PartnerFoodListProps {
  onBack: () => void;
}

const FoodListItem: React.FC<{ item: FoodItem, isActive: boolean }> = ({ item, isActive }) => {
    const { t } = useContext(LanguageContext)!;

    let statusPill;
    if (isActive) {
        statusPill = <div className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-300">{t('active')}</div>;
    } else if (item.stock <= 0) {
        statusPill = <div className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-800 rounded-full dark:bg-gray-900 dark:text-gray-300">{t('soldOut')}</div>;
    } else {
        statusPill = <div className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-300">{t('expired')}</div>;
    }

    return (
        <div className={`p-4 rounded-lg shadow-sm flex gap-4 ${isActive ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-800/50 opacity-80'}`}>
            <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <p className="font-bold text-dark dark:text-light pr-2">{item.name}</p>
                    {statusPill}
                </div>
                <div className="mt-2 text-sm space-y-1.5 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <Package size={14} />
                        <span>{t('stock')}: <span className="font-semibold text-dark dark:text-light">{item.stock}</span></span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Tag size={14} />
                         <span>{t('rp')} {item.discountedPrice.toLocaleString()}</span>
                         {item.discountedPrice < item.originalPrice && <span className="line-through text-xs">{t('rp')} {item.originalPrice.toLocaleString()}</span>}
                    </div>
                    {isActive && (
                        <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <CountdownTimer expiresAt={item.expiresAt} onExpire={() => { /* Data will reflow on next render */ }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PartnerFoodList: React.FC<PartnerFoodListProps> = ({ onBack }) => {
    const { t } = useContext(LanguageContext)!;
    const dataContext = useContext(DataContext);
    const authContext = useContext(AuthContext);

    const partnerId = authContext?.currentUser?.id;

    const { activeItems, pastItems } = useMemo(() => {
        if (partnerId) {
            const allItems = dataContext?.getFoodItemsForPartner(partnerId) ?? [];
            const now = new Date();
            const active = allItems.filter(item => item.stock > 0 && new Date(item.expiresAt) > now);
            const past = allItems.filter(item => item.stock <= 0 || new Date(item.expiresAt) <= now);
            return { activeItems: active, pastItems: past };
        }
        return { activeItems: [], pastItems: [] };
    }, [dataContext, partnerId, dataContext?.foodItems]); // Need to listen to foodItems for updates

    if (!partnerId) return null;

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center mb-4">
                <button onClick={onBack} className="p-2 mr-2 text-dark dark:text-light">
                    <ChevronLeft />
                </button>
                <h2 className="text-xl font-bold text-dark dark:text-light">{t('myListingsTitle')}</h2>
            </div>

            {activeItems.length === 0 && pastItems.length === 0 ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    <Inbox size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="font-semibold text-lg">{t('noFoodPosted')}</p>
                    <p className="text-sm mt-1">{t('postYourFirstItem')}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <section>
                        <h3 className="text-lg font-bold text-dark dark:text-light mb-3">{t('activeListings')} ({activeItems.length})</h3>
                        {activeItems.length > 0 ? (
                            <div className="space-y-3">
                                {activeItems.map(item => <FoodListItem key={item.id} item={item} isActive={true} />)}
                            </div>
                        ) : <p className="text-sm text-gray-500 dark:text-gray-400">{t('noActiveReservations')}</p>}
                    </section>
                    <section>
                        <h3 className="text-lg font-bold text-dark dark:text-light mb-3">{t('pastListings')} ({pastItems.length})</h3>
                         {pastItems.length > 0 ? (
                            <div className="space-y-3">
                                {pastItems.map(item => <FoodListItem key={item.id} item={item} isActive={false} />)}
                            </div>
                        ) : <p className="text-sm text-gray-500 dark:text-gray-400">{t('historyWillAppearHere')}</p>}
                    </section>
                </div>
            )}
        </div>
    );
};

export default PartnerFoodList;
