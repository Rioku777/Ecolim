
    import React, { useState, useRef } from 'react';
    import { MapPin, Camera, Send, UploadCloud, Sprout, PackageOpen, DollarSign } from 'lucide-react';
    import { motion } from 'framer-motion';
    import NeumorphicCard from '@/components/NeumorphicCard';
    import NeumorphicButton from '@/components/NeumorphicButton';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from "@/components/ui/use-toast";
    import { useAuth } from '@/contexts/AuthContext';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

    const RegisterActionPage = () => {
      const [actionType, setActionType] = useState('tree'); // 'tree' or 'bottle'
      const [location, setLocation] = useState(null);
      const [photo, setPhoto] = useState(null);
      const [previewUrl, setPreviewUrl] = useState(null);
      const [bottleCount, setBottleCount] = useState('');
      const [loadingLocation, setLoadingLocation] = useState(false);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const fileInputRef = useRef(null);
      const { toast } = useToast();
      const { user } = useAuth();

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

      const resetForm = () => {
        setLocation(null);
        setPhoto(null);
        setPreviewUrl(null);
        setBottleCount('');
        if(fileInputRef.current) fileInputRef.current.value = ''; 
        setIsSubmitting(false);
      }

      const handleSubmit = (e) => {
         e.preventDefault();
         setIsSubmitting(true);

         if (!location || !photo) {
            toast({
               title: "Faltan Datos",
               description: `Por favor, proporciona la ubicación GPS y una foto para ${actionType === 'tree' ? 'el árbol' : 'las botellas'}.`,
               variant: "destructive",
            });
            setIsSubmitting(false);
            return;
         }
         if (actionType === 'bottle' && (!bottleCount || parseInt(bottleCount) <= 0)) {
            toast({
               title: "Cantidad Inválida",
               description: "Por favor, ingresa una cantidad válida de botellas.",
               variant: "destructive",
            });
            setIsSubmitting(false);
            return;
         }

         setTimeout(() => {
            let pointsEarned = 0;
            let incomeEarned = 0;
            let messageTitle = "";
            let messageDescription = "";

            if (actionType === 'tree') {
                pointsEarned = 10; // Points for planting a tree
                incomeEarned = 0.5; // Symbolic income for a tree
                const currentPlanted = parseInt(localStorage.getItem(`treesPlantedThisMonth_${user.id}`) || '0', 10);
                localStorage.setItem(`treesPlantedThisMonth_${user.id}`, (currentPlanted + 1).toString());
                messageTitle = "¡Árbol Registrado!";
                messageDescription = `Gracias por plantar un árbol. Has ganado ${pointsEarned} puntos y ${incomeEarned.toFixed(2)} en ingresos simbólicos.`;
            } else { // bottle
                const numBottles = parseInt(bottleCount, 10);
                pointsEarned = numBottles * 1; // 1 point per bottle
                incomeEarned = numBottles * 0.05; // Symbolic income per bottle
                const currentBottles = parseInt(localStorage.getItem(`bottlesCollected_${user.id}`) || '0', 10);
                localStorage.setItem(`bottlesCollected_${user.id}`, (currentBottles + numBottles).toString());
                messageTitle = "¡Botellas Registradas!";
                messageDescription = `Gracias por recoger ${numBottles} botellas. Has ganado ${pointsEarned} puntos y ${incomeEarned.toFixed(2)} en ingresos simbólicos.`;
            }
            
            const currentTotalPoints = parseInt(localStorage.getItem(`totalPoints_${user.id}`) || '0', 10);
            localStorage.setItem(`totalPoints_${user.id}`, (currentTotalPoints + pointsEarned).toString());

            const currentTotalIncome = parseFloat(localStorage.getItem(`totalIncome_${user.id}`) || '0');
            localStorage.setItem(`totalIncome_${user.id}`, (currentTotalIncome + incomeEarned).toString());
            
            toast({
              title: messageTitle,
              description: messageDescription,
            });
            
            resetForm();
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
            <motion.h1 variants={formVariants} className="text-2xl md:text-3xl font-bold text-center text-primary mb-4 md:mb-6">
                Registrar Acción Ecológica
            </motion.h1>

            <Tabs defaultValue="tree" onValueChange={(value) => { setActionType(value); resetForm();}} className="w-full mb-4 md:mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tree" className="text-sm md:text-base py-2.5 data-[state=active]:shadow-neumorphic-concave">
                    <Sprout className="mr-2 h-4 w-4 md:h-5 md:w-5"/> Plantar Árbol
                </TabsTrigger>
                <TabsTrigger value="bottle" className="text-sm md:text-base py-2.5 data-[state=active]:shadow-neumorphic-concave">
                    <PackageOpen className="mr-2 h-4 w-4 md:h-5 md:w-5"/> Recoger Botellas
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <motion.div variants={formVariants}>
                <Label htmlFor="location-btn" className="text-md md:text-lg mb-1 md:mb-2 block">
                  <MapPin className="inline-block mr-2 h-5 w-5 text-brand-brown" />
                  Ubicación GPS de la Acción
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
                  Foto de Evidencia
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
                         <img-replace src={previewUrl} alt={`Vista previa de ${actionType === 'tree' ? 'árbol' : 'botellas'}`} className="mx-auto h-32 md:h-40 w-auto object-contain rounded-md mb-2 shadow-neumorphic-flat" />
                     ) : (
                         <UploadCloud className="mx-auto h-12 md:h-16 w-12 md:w-16 text-muted-foreground mb-2"/>
                     )}
                    <p className="text-xs md:text-sm text-muted-foreground">{previewUrl ? 'Cambiar Foto' : 'Haz clic o arrastra para subir foto'}</p>
                 </NeumorphicCard>
                 {!photo && <p className="text-xs text-muted-foreground mt-1">Sube una foto clara de tu acción.</p>}
              </motion.div>

              {actionType === 'bottle' && (
                <motion.div variants={formVariants}>
                    <Label htmlFor="bottle-count" className="text-md md:text-lg mb-1 md:mb-2 block">
                        <PackageOpen className="inline-block mr-2 h-5 w-5 text-blue-500" />
                        Cantidad de Botellas
                    </Label>
                    <Input 
                        id="bottle-count"
                        type="number"
                        placeholder="Ej: 25"
                        value={bottleCount}
                        onChange={(e) => setBottleCount(e.target.value)}
                        min="1"
                        className="text-base py-3"
                    />
                </motion.div>
              )}

              <motion.div variants={formVariants}>
                <NeumorphicButton
                  type="submit"
                  disabled={!location || !photo || (actionType === 'bottle' && (!bottleCount || parseInt(bottleCount) <=0)) || isSubmitting}
                  className="w-full text-md md:text-lg py-2.5 md:py-3"
                   variant="primary"
                >
                  {isSubmitting ? 'Enviando...' : <><Send className="mr-2 h-5 w-5" /> Registrar Acción</>}
                </NeumorphicButton>
              </motion.div>
            </form>
          </NeumorphicCard>
        </motion.div>
      );
    };

    export default RegisterActionPage;
  