
    import React, { useState, useEffect } from 'react';
    import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
    import { motion } from 'framer-motion';
    import NeumorphicCard from '@/components/NeumorphicCard';
    import { Sprout } from 'lucide-react';
    import L from 'leaflet';

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
    
    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const sampleTrees = [
      { id: 1, position: [12.8654, -85.2072], user: 'Usuario Ecolim 1', date: '2025-05-04' }, 
      { id: 2, position: [12.1328, -86.2504], user: 'Guardián Ecolim', date: '2025-05-03' }, 
      { id: 3, position: [11.5733, -85.5180], user: 'Siembra Ecolim', date: '2025-05-05' }, 
       { id: 4, position: [13.1014, -85.9172], user: 'Ecolim Planter', date: '2025-05-01' }, 
       { id: 5, position: [11.2514, -85.8731], user: 'Ecolim Roots', date: '2025-05-02' }, 
    ];

    const MapView = () => {
      const nicaraguaCenter = [12.8654, -85.2072]; 
      const [plantedTrees, setPlantedTrees] = useState(sampleTrees);

       const cardVariants = {
             hidden: { opacity: 0, y: 20 },
             visible: { opacity: 1, y: 0 }
        };

      return (
         <motion.div 
             initial="hidden"
             animate="visible"
             variants={cardVariants}
             className="w-full"
         >
            <NeumorphicCard className="p-0 overflow-hidden">
                 <div className="p-4 md:p-6 pb-2 md:pb-2 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-primary">
                        <Sprout className="inline-block mr-2 h-6 w-6 md:h-7 md:w-7" />
                        Mapa Verde Ecolim
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground mt-1">Visualiza las acciones de reforestación.</p>
                 </div>
                <MapContainer 
                    center={nicaraguaCenter} 
                    zoom={7} 
                    scrollWheelZoom={true} 
                    className="h-[50vh] md:h-[60vh] w-full rounded-b-neumorphic"
                 >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & Ecolim'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {plantedTrees.map(tree => (
                    <Marker key={tree.id} position={tree.position} icon={greenIcon}>
                      <Popup>
                        Plantado por: <strong>{tree.user}</strong><br />
                        Fecha: {tree.date}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
             </NeumorphicCard>
         </motion.div>
      );
    };

    export default MapView;
  