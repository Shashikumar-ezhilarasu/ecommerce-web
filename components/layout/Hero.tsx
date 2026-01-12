'use client';

export function Hero() {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fashion DApp Store
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8">
            Discover Premium Fashion • Pay with CREDFI
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <p className="text-sm text-primary-100">👗 Premium Fashion</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <p className="text-sm text-primary-100">💳 CREDFI Payment</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <p className="text-sm text-primary-100">🚚 Fast Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
