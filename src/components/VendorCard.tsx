'use client';

interface Vendor {
  id: number;
  name: string;
  nameEn: string;
  price: number;
  location: string;
  rating?: number;
  totalReviews?: number;
  isOnline?: boolean;
  responseTime?: string;
  specialties?: string[];
  specialtiesHindi?: string[];
  verified?: boolean;
}

interface VendorCardProps {
  vendor: Vendor;
  productName: string;
  productNameHindi: string;
  onClick: (vendorId: number) => void;
  isLowestPrice?: boolean;
  isHighestPrice?: boolean;
  averagePrice?: number;
}

export default function VendorCard({ 
  vendor, 
  productName, 
  productNameHindi, 
  onClick, 
  isLowestPrice = false,
  isHighestPrice = false,
  averagePrice 
}: VendorCardProps) {
  const getPriceColor = () => {
    if (isLowestPrice) return 'text-teal-600 dark:text-teal-400';
    if (isHighestPrice) return 'text-red-600 dark:text-red-400';
    return 'text-teal-600 dark:text-teal-400';
  };

  const getPriceBadge = () => {
    if (isLowestPrice) return { text: 'Best Price', color: 'bg-gradient-to-r from-teal-500 to-teal-600', emoji: '🏆' };
    if (isHighestPrice) return { text: 'Premium', color: 'bg-gradient-to-r from-red-500 to-red-600', emoji: '💎' };
    if (averagePrice && vendor.price < averagePrice) return { text: 'Good Deal', color: 'bg-gradient-to-r from-blue-500 to-blue-600', emoji: '👍' };
    return null;
  };

  const priceBadge = getPriceBadge();

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] p-5 cursor-pointer border-2 border-gray-200 dark:border-gray-700 group relative overflow-hidden"
      onClick={() => onClick(vendor.id)}
    >
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      
      {/* Online Status Indicator */}
      {vendor.isOnline && (
        <div className="absolute top-4 left-4 w-3 h-3 bg-teal-500 rounded-full animate-pulse shadow-lg z-10"></div>
      )}

      <div className="relative z-10">
        {/* Main Content */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Left: Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-teal-500 rounded-xl flex items-center justify-center text-3xl shadow-lg relative transform group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
            🏪
            {vendor.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs shadow-lg">
                ✓
              </div>
            )}
          </div>
          
          {/* Middle: Vendor Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors duration-300">
                  {vendor.name}
                  {vendor.verified && (
                    <span className="ml-2 text-blue-500 text-xs bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">✓</span>
                  )}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">({vendor.nameEn})</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">📍 {vendor.location}</p>
              </div>
              
              {/* Right: Price Badge and Price */}
              <div className="text-right flex-shrink-0">
                {priceBadge && (
                  <div className={`${priceBadge.color} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md mb-2 ml-auto w-fit`}>
                    <span>{priceBadge.emoji}</span>
                    {priceBadge.text}
                  </div>
                )}
                <div className={`text-3xl font-extrabold ${getPriceColor()}`}>
                  ₹{vendor.price}
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">/kg</span>
                </div>
                {averagePrice && (
                  <div className="text-xs mt-1">
                    {vendor.price < averagePrice ? (
                      <span className="text-teal-600 dark:text-teal-400 font-semibold">
                        ₹{(averagePrice - vendor.price).toFixed(0)} below avg
                      </span>
                    ) : vendor.price > averagePrice ? (
                      <span className="text-red-500 font-semibold">
                        ₹{(vendor.price - averagePrice).toFixed(0)} above avg
                      </span>
                    ) : (
                      <span className="text-gray-500">At avg</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Rating and Specialties */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {vendor.rating && (
                <>
                  <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{vendor.rating}</span>
                  </div>
                  {vendor.totalReviews && (
                    <span className="text-xs text-gray-600 dark:text-gray-400">({vendor.totalReviews})</span>
                  )}
                </>
              )}
              {vendor.responseTime && (
                <span className="text-xs text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-full font-semibold">
                  ⚡ {vendor.responseTime}
                </span>
              )}
              {vendor.specialties && vendor.specialties.slice(0, 2).map((specialty, index) => (
                <span 
                  key={index}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>

            {/* Product and Button */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-700 dark:text-gray-300 flex-1">
                <span className="font-semibold">Product:</span> {productName} ({productNameHindi})
              </p>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap">
                Contact →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}