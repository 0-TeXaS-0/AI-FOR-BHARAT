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
    if (isLowestPrice) return 'text-[#2ECC40]';
    if (isHighestPrice) return 'text-red-500';
    return 'text-[#2ECC40]';
  };

  const getPriceBadge = () => {
    if (isLowestPrice) return { text: 'Best Price', color: 'bg-[#2ECC40]', emoji: '🏆' };
    if (isHighestPrice) return { text: 'Premium', color: 'bg-red-500', emoji: '💎' };
    if (averagePrice && vendor.price < averagePrice) return { text: 'Good Deal', color: 'bg-blue-500', emoji: '👍' };
    return null;
  };

  const priceBadge = getPriceBadge();

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] p-4 md:p-6 cursor-pointer border border-gray-100 dark:border-gray-700 group relative overflow-hidden"
      onClick={() => onClick(vendor.id)}
    >
      {/* Price Badge */}
      {priceBadge && (
        <div className={`absolute top-4 right-4 ${priceBadge.color} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10`}>
          <span>{priceBadge.emoji}</span>
          {priceBadge.text}
        </div>
      )}

      {/* Online Status Indicator */}
      {vendor.isOnline && (
        <div className="absolute top-4 left-4 w-3 h-3 bg-[#2ECC40] rounded-full animate-pulse z-10"></div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Vendor Avatar */}
        <div className="w-full sm:w-20 h-20 bg-gradient-to-br from-[#2ECC40] to-green-600 rounded-xl flex items-center justify-center text-3xl shadow-md relative">
          🏪
          {vendor.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
              ✓
            </div>
          )}
        </div>
        
        {/* Vendor Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg md:text-xl text-gray-800 dark:text-white group-hover:text-[#FF851B] transition-colors">
                  {vendor.name}
                </h3>
                {vendor.verified && (
                  <span className="text-blue-500 text-sm">✓ Verified</span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                ({vendor.nameEn})
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 mt-1">
                📍 {vendor.location}
              </p>
              
              {/* Rating and Reviews */}
              {vendor.rating && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {vendor.rating}
                    </span>
                  </div>
                  {vendor.totalReviews && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({vendor.totalReviews} reviews)
                    </span>
                  )}
                  {vendor.responseTime && (
                    <span className="text-xs text-[#2ECC40] bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      ⚡ {vendor.responseTime}
                    </span>
                  )}
                </div>
              )}

              {/* Specialties */}
              {vendor.specialties && vendor.specialties.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {vendor.specialties.slice(0, 2).map((specialty, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Price Section */}
            <div className="text-right sm:text-right">
              <div className={`text-2xl md:text-3xl font-bold ${getPriceColor()} mb-1 relative`}>
                ₹{vendor.price}
                <span className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-normal">/kg</span>
                {isLowestPrice && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#2ECC40] rounded-full flex items-center justify-center text-white text-xs animate-bounce">
                    ↓
                  </div>
                )}
              </div>
              
              {/* Price Comparison */}
              {averagePrice && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {vendor.price < averagePrice ? (
                    <span className="text-[#2ECC40]">
                      ₹{(averagePrice - vendor.price).toFixed(0)} below avg
                    </span>
                  ) : vendor.price > averagePrice ? (
                    <span className="text-red-500">
                      ₹{(vendor.price - averagePrice).toFixed(0)} above avg
                    </span>
                  ) : (
                    <span>At average price</span>
                  )}
                </div>
              )}
              
              <div className="bg-[#FF851B] hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 inline-block">
                Contact Vendor →
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Product:</span> {productName} ({productNameHindi})
            </p>
          </div>
        </div>
      </div>
      
      {/* Hover Effect Indicator */}
      <div className="mt-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-12 h-1 bg-[#FF851B] rounded-full"></div>
      </div>

      {/* Gradient overlay for premium effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#FF851B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-2xl"></div>
    </div>
  );
}