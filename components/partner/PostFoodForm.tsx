import React, { useState, useContext, useEffect } from 'react';
import { ChevronLeft, Upload, MapPin, ExternalLink } from 'lucide-react';
import { LanguageContext } from '../../context/ThemeContext';

interface PostFoodFormProps {
  onBack: () => void;
  onPost: (formData: any) => void;
  initialAddress: string;
  initialLat: number;
  initialLng: number;
}

const PostFoodForm: React.FC<PostFoodFormProps> = ({ onBack, onPost, initialAddress, initialLat, initialLng }) => {
  const { t } = useContext(LanguageContext)!;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: '1',
    originalPrice: '',
    discountedPrice: '0',
    expiresInHours: '4',
    isSurpriseMeal: true, // Start as true because price is '0'
    category: 'Lainnya',
    image: null as File | null,
    address: initialAddress,
    lat: initialLat,
    lng: initialLng,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customExpiryTime, setCustomExpiryTime] = useState('23:59');

  const isFree = formData.discountedPrice === '0';

  useEffect(() => {
    // Automatically check and disable "Surprise Meal" if the item is free
    setFormData(prev => ({ ...prev, isSurpriseMeal: isFree }));
  }, [isFree]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
        setFormData(prev => ({...prev, [name]: value ? parseFloat(value) : ''}));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalExpiresInHours = formData.expiresInHours;
    if (formData.expiresInHours === 'custom') {
        if (!customExpiryTime) {
            alert(t('alert.selectCustomTime'));
            return;
        }
        const [hours, minutes] = customExpiryTime.split(':').map(Number);
        const now = new Date();
        const expiryDate = new Date();
        expiryDate.setHours(hours, minutes, 0, 0);

        // If the selected time has already passed today, set it for tomorrow
        if (expiryDate < now) {
            expiryDate.setDate(expiryDate.getDate() + 1);
        }
        
        const diffMs = expiryDate.getTime() - now.getTime();
        finalExpiresInHours = (diffMs / 3600000).toString(); // convert ms to hours
    }

    onPost({ ...formData, expiresInHours: finalExpiresInHours });
  };

  const foodCategories = [
    'Makanan Berat',
    'Roti',
    'Minuman',
    'Kue',
    'Lainnya',
  ];

  return (
    <div className="p-4 space-y-4">
        <div className="flex items-center mb-4">
            <button onClick={onBack} className="p-2 mr-2 text-dark dark:text-light">
                <ChevronLeft />
            </button>
            <h2 className="text-xl font-bold text-dark dark:text-light">{t('postNewFood')}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
             <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm space-y-4">
                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('foodImage')}</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto object-cover rounded-md"/>
                            ) : (
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            )}
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                                    <span>{t('uploadAFile')}</span>
                                    <input id="file-upload" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                </label>
                                <p className="pl-1">{t('orDragAndDrop')}</p>
                            </div>
                            <p className="text-xs text-gray-500">{t('imageFileTypes')}</p>
                        </div>
                    </div>
                </div>
                
                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('originalPrice')}</label>
                        <input type="number" name="originalPrice" id="originalPrice" value={formData.originalPrice} onChange={handleChange} required min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                     <div>
                        <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('discountedPrice')}</label>
                        <input type="number" name="discountedPrice" id="discountedPrice" value={formData.discountedPrice} onChange={handleChange} required min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                </div>

                {/* Surprise Meal Toggle */}
                <div className="flex items-center justify-between bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-md">
                    <div>
                        <p className="font-semibold text-yellow-800 dark:text-yellow-300">{t('isSurpriseMeal')}</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400">{t('surpriseMealInfo')}</p>
                    </div>
                    <label htmlFor="isSurpriseMeal" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="isSurpriseMeal" name="isSurpriseMeal" checked={formData.isSurpriseMeal} onChange={handleChange} className="sr-only peer" disabled={isFree} />
                        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary ${isFree ? 'cursor-not-allowed' : ''}`}></div>
                    </label>
                </div>

                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('foodName')}</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('description')}</label>
                    <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                </div>

                {/* Category */}
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('category')}</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                       {foodCategories.map(cat => <option key={cat} value={cat}>{t(cat.replace(' ', '').toLowerCase()) || cat}</option>)}
                    </select>
                </div>

                {/* Stock and Expiry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('stock')}</label>
                        <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required min="1" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                    <div>
                        <label htmlFor="expiresInHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('expiresIn')}</label>
                        <select id="expiresInHours" name="expiresInHours" value={formData.expiresInHours} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="0.5">30 {t('minutes')}</option>
                            <option value="1">1 {t('hour')}</option>
                            <option value="2">2 {t('hours')}</option>
                            <option value="4">4 {t('hours')}</option>
                            <option value="8">8 {t('hours')}</option>
                            <option value="24">24 {t('hours')}</option>
                            <option value="48">2 {t('days')}</option>
                            <option value="72">3 {t('days')}</option>
                            <option value="custom">{t('custom')}</option>
                        </select>
                    </div>
                </div>
                {formData.expiresInHours === 'custom' && (
                     <div className="col-span-1 md:col-span-2">
                        <label htmlFor="customExpiryTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('customTime')}</label>
                        <input type="time" name="customExpiryTime" id="customExpiryTime" value={customExpiryTime} onChange={(e) => setCustomExpiryTime(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                )}

                {/* Address & Map */}
                 <div>
                     <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('pickupAddress')}</label>
                     <div className="relative mt-1">
                        <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-10"/>
                        <button type="button" onClick={() => setFormData(prev => ({...prev, address: initialAddress, lat: initialLat, lng: initialLng}))} className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary" title={t('useCurrentAddress')}>
                            <MapPin size={20} />
                        </button>
                     </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('pickupLocationOnMap')}</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2" dangerouslySetInnerHTML={{ __html: t('findOnMapInstructions', { url: 'https://www.google.com/maps' }) }} />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="lat" className="block text-xs font-medium text-gray-700 dark:text-gray-300">Latitude</label>
                            <input type="number" name="lat" id="lat" value={formData.lat} onChange={handleChange} step="any" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                        </div>
                        <div>
                            <label htmlFor="lng" className="block text-xs font-medium text-gray-700 dark:text-gray-300">Longitude</label>
                            <input type="number" name="lng" id="lng" value={formData.lng} onChange={handleChange} step="any" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                        </div>
                    </div>
                    {(formData.lat && formData.lng) ? (
                        <div className="mt-2 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                            <iframe
                                key={`${formData.lat}-${formData.lng}`} // Force re-render on change
                                className="w-full h-full border-0"
                                loading="lazy"
                                allowFullScreen
                                src={`https://www.google.com/maps?q=${formData.lat},${formData.lng}&output=embed&z=15`}>
                            </iframe>
                        </div>
                    ) : null}
                </div>
            </div>

            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl text-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400">
                {t('postFood')}
            </button>
        </form>
    </div>
  );
};

export default PostFoodForm;