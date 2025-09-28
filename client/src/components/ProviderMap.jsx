import React, { useEffect, useRef } from 'react';

const ProviderMap = ({ providers, center = { lat: 19.044081, lng: 73.065642 }, zoom = 13 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (!window.google) {
      // Create script element for Google Maps
      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
      
      // If we have a real API key, load Google Maps
      if (apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        // If no API key, show a message
        mapRef.current.innerHTML = `
          <div class="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <div class="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
              <h3 class="text-xl font-bold text-gray-800 mb-2">Google Maps API Key Required</h3>
              <p class="text-gray-600 mb-4">
                To display the interactive map, please add your Google Maps API key to the .env file.
              </p>
              <div class="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4"></div>
              <p class="text-sm text-gray-500">
                Current view shows provider locations on a static map representation.
              </p>
            </div>
          </div>
        `;
      }
    } else {
      initMap();
    }

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && window.google) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add new markers for providers
      providers.forEach(provider => {
        if (provider.location && provider.location.coordinates) {
          const marker = new window.google.maps.Marker({
            position: {
              lat: provider.location.coordinates[1],
              lng: provider.location.coordinates[0]
            },
            map: mapInstanceRef.current,
            title: provider.businessName
          });

          // Add info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div>
                <h3 class="font-bold">${provider.businessName}</h3>
                <p class="text-sm">Visit Charge: ₹${provider.visitCharge}</p>
                <p class="text-sm">${provider.address}</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(mapInstanceRef.current, marker);
          });

          markersRef.current.push(marker);
        }
      });
    }
  }, [providers]);

  const initMap = () => {
    if (window.google && mapRef.current) {
      const mapOptions = {
        center: { lat: center.lat, lng: center.lng },
        zoom: zoom,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP
      };

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

      // Add markers for providers
      providers.forEach(provider => {
        if (provider.location && provider.location.coordinates) {
          const marker = new window.google.maps.Marker({
            position: {
              lat: provider.location.coordinates[1],
              lng: provider.location.coordinates[0]
            },
            map: mapInstanceRef.current,
            title: provider.businessName
          });

          // Add info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div>
                <h3 class="font-bold">${provider.businessName}</h3>
                <p class="text-sm">Visit Charge: ₹${provider.visitCharge}</p>
                <p class="text-sm">${provider.address}</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(mapInstanceRef.current, marker);
          });

          markersRef.current.push(marker);
        }
      });
    }
  };

  return (
    <div ref={mapRef} className="w-full h-full">
      {/* Placeholder content while map loads or if there's no API key */}
      {!window.google && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderMap;