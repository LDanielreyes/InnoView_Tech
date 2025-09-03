import { defineConfig } from "vite";
import { resolve } from "path";


export default defineConfig({
  root: ".", 
  build: {
    outDir: "dist", 
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),                    
        login: resolve(__dirname, "app/view/login.html"),          
        register: resolve(__dirname, "app/view/register.html"),    
        search: resolve(__dirname, "app/view/search.html"),        
        inventory: resolve(__dirname, "app/view/inventory.html"),  
      },
    },
  },
});
