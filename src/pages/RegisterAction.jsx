
    import React, { useState, useRef } from 'react';
    import { MapPin, Camera, Send, UploadCloud } from 'lucide-react';
    import { motion } from 'framer-motion';
    import NeumorphicCard from '@/components/NeumorphicCard';
    import NeumorphicButton from '@/components/NeumorphicButton';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from "@/components/ui/use-toast";

    const RegisterAction = () => {
      const [location, setLocation] = useState(null);
      const [photo, setPhoto] = useState(null);
      const [previewUrl, setPreviewUrl] = useState(null);
      const [loadingLocation, setLoadingLocation] = useState(false);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const fileInputRef = useRef(null);
      const { toast } = useToast();

      const handleGetLocation = () => {
        setLoadingLocation(true);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ lat: latitude, lng: longitude });
              setLoadingLocation(false);
               toast({
                  title: "Ubicación Obtenida",
                  description: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
              });
            },
            (error) => {
              console.error("Error getting location:", error);
              setLoadingLocation(false);
              toast({
                title: "Error de Ubicación",
                description: "No se pudo obtener la ubicación. Asegúrate de haber concedido permiso.",
                variant: "destructive",
              });
            },
             { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        } else {
           setLoadingLocation(false);
          toast({
            title: "Error",
            description: "La geolocalización no es soportada por este navegador.",
            variant: "destructive",
          });
        }
      };

      const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setPhoto(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrl(reader.result);
          };
          reader.readAsDataURL(file);
           toast({
              title: "Foto Seleccionada",
              description: file.name,
           });
        }
      };

       const handleTriggerFileInput = () => {
         fileInputRef.current?.click();
      };


      const handleSubmit = (e) => {
         e.preventDefault();
         setIsSubmitting(true);

         if (!location || !photo) {
            toast({
               title: "Faltan Datos",
               description: "Por favor, proporciona la ubicación GPS y una foto del árbol.",
               variant: "destructive",
            });
            setIsSubmitting(false);
            return;
         }

         setTimeout(() => {
             const currentPlanted = parseInt(localStorage.getItem('treesPlantedThisMonth') || '0', 10);
             const newPlantedCount = currentPlanted + 1;
             localStorage.setItem('treesPlantedThisMonth', newPlantedCount.toString());

             const currentPoints = parseInt(localStorage.getItem('totalPoints') || '0', 10);
             const newTotalPoints = currentPoints + 10; 
             localStorage.setItem('totalPoints', newTotalPoints.toString());

             toast({
               title: "¡Acción Registrada!",
               description: "Gracias por plantar un árbol. Tu acción ha sido registrada.",
             });

             setLocation(null);
             setPhoto(null);
             setPreviewUrl(null);
             if(fileInputRef.current) fileInputRef.current.value = ''; 
             setIsSubmitting(false);

         }, 1500); 
      };

      const formVariants = {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } }
      };

      return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={formVariants}
            className="max-w-xl mx-auto"
        >
          <NeumorphicCard className="p-4 md:p-6">
            <motion.h1 variants={formVariants} className="text-2xl md:text-3xl font-bold text-center text-primary mb-4 md:mb-6">Registrar Nuevo Árbol</motion.h1>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <motion.div variants={formVariants}>
                <Label htmlFor="location-btn" className="text-md md:text-lg mb-1 md:mb-2 block">
                  <MapPin className="inline-block mr-2 h-5 w-5 text-brand-brown" />
                  Ubicación GPS
                </Label>
                <NeumorphicButton
                  id="location-btn"
                  type="button"
                  onClick={handleGetLocation}
                  disabled={loadingLocation || !!location}
                  className="w-full text-sm md:text-base py-2 md:py-2.5"
                  variant="secondary"
                >
                  {loadingLocation
                    ? 'Obteniendo...'
                    : location
                    ? `Guardada (${location.lat.toFixed(2)}, ${location.lng.toFixed(2)})`
                    : 'Obtener Ubicación'}
                </NeumorphicButton>
                 {!location && <p className="text-xs text-muted-foreground mt-1">Necesitamos tu ubicación para verificar.</p>}
              </motion.div>

              <motion.div variants={formVariants}>
                <Label htmlFor="photo-upload" className="text-md md:text-lg mb-1 md:mb-2 block">
                  <Camera className="inline-block mr-2 h-5 w-5 text-brand-green" />
                  Foto del Árbol
                </Label>
                 <NeumorphicCard concave className="p-3 md:p-4 text-center cursor-pointer hover:bg-accent/10 transition-colors" onClick={handleTriggerFileInput}>
                     <input
                        id="photo-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                     {previewUrl ? (
                         <img-replace src={previewUrl} alt="Vista previa del árbol" className="mx-auto h-32 md:h-40 w-auto object-contain rounded-md mb-2 shadow-neumorphic-flat" />
                     ) : (
                         <UploadCloud className="mx-auto h-12 md:h-16 w-12 md:w-16 text-muted-foreground mb-2"/>
                     )}
                    <p className="text-xs md:text-sm text-muted-foreground">{previewUrl ? 'Cambiar Foto' : 'Haz clic o arrastra para subir foto'}</p>
                 </NeumorphicCard>
                 {!photo && <p className="text-xs text-muted-foreground mt-1">Sube una foto clara del árbol.</p>}
              </motion.div>

              <motion.div variants={formVariants}>
                <NeumorphicButton
                  type="submit"
                  disabled={!location || !photo || isSubmitting}
                  className="w-full text-md md:text-lg py-2.5 md:py-3"
                   variant="primary"
                >
                  {isSubmitting ? 'Enviando...' : <><Send className="mr-2 h-5 w-5" /> Registrar Plantación</>}
                </NeumorphicButton>
              </motion.div>
            </form>
          </NeumorphicCard>
        </motion.div>
      );
    };

    export default RegisterAction;
  