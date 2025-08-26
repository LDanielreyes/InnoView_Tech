import { loadEPS } from "./load_eps.js"
import { loadMedicines } from "./load_medicines.js"
import { loadAP } from "./load_AP.js"
import { loadUsers } from "./load_user.js"
import { loadInventories } from "./load_inventories.js"
import { loadPharmacists } from "./load_pharmacists.js"
(async () => {
    try {
        // Log server startup
        console.log("Starting server...")

        //await loadEPS()
        //await loadMedicines()
        //await loadAP()
        await loadUsers()
        await loadInventories()
        await loadPharmacists()
        
        // Log completion of seeders
        console.log("Seeders load complete")

    } catch (error) {
        // Handle errors during seeder execution
        console.error(`Error loading the seeders: ${error.message}`)
    } finally {
        // Exit the process after execution
        process.exit()
    }
})()