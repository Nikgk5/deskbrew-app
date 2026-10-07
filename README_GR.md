# ☕️ DeskBrew — Εφαρμογή Εύρεσης Καφέ για Remote Εργασία

Το DeskBrew είναι μια πλήρης, map-based διαδικτυακή εφαρμογή (full-stack), σχεδιασμένη ειδικά για ψηφιακούς νομάδες (digital nomads) και επαγγελματίες που εργάζονται απομακρυσμένα. Με ένα καθαρό, μοντέρνο UI εμπνευσμένο από την Airbnb, η εφαρμογή επιτρέπει στους χρήστες να ανακαλύπτουν εύκολα χώρους εργασίας και καφετέριες παγκοσμίως, με βάση κρίσιμα κριτήρια όπως η ταχύτητα του WiFi, η ησυχία και η διαθεσιμότητα σε πρίζες.

> **Σημείωση για Recruiters:** Αυτό το repository έχει δομηθεί με έμφαση στο backend, με σκοπό να αναδείξει ισχυρές δεξιότητες σε **Python**, **SQL**, και **Διαχείριση Βάσεων Δεδομένων**. Παρόλο που το frontend διαθέτει ένα εξαιρετικά προσεγμένο και επαγγελματικό UI, η καρδιά της εφαρμογής βασίζεται σε πολύπλοκα γεωχωρικά ερωτήματα (spatial queries), αυτοματισμούς βάσεων δεδομένων, και ένα εξαιρετικά δομημένο Python REST API.

---

## 🐍 Highlights Μηχανικής: Python & SQL

Αυτό το project δημιουργήθηκε εξαρχής για να επιδείξει μια production-ready προσέγγιση στην αρχιτεκτονική backend, τη διαχείριση δεδομένων, και την αυτοματοποιημένη συντήρηση.

### 1. Ισχυρά Data Pipelines & Αυτοματοποίηση Seeding
Αντί για χειροκίνητη εισαγωγή δεδομένων, το project χρησιμοποιεί ένα custom data migration pipeline που συνδυάζει **Python** και **SQL**:
- **Scripts `backend/run_seed_*.py`:** Αυτά τα Python scripts αυτοματοποιούν τη διαδικασία ασφαλούς σύνδεσης στη βάση PostgreSQL μέσω του `SQLAlchemy` και εκτελούν πολύπλοκα SQL migrations.
- **Αρχεία `backend/sql/*.sql`:** Αυτά τα αρχεία ορίζουν το σχήμα (schema) της βάσης δεδομένων και εισάγουν τα επιλεγμένα δεδομένα. Είναι γραμμένα με τέτοιο τρόπο ώστε να είναι **idempotent** (μπορούν δηλαδή να εκτελεστούν πολλές φορές χωρίς να προκαλέσουν σφάλματα ή διπλοεγγραφές δεδομένων), χρησιμοποιώντας προηγμένες εντολές της PostgreSQL όπως η `ON CONFLICT DO UPDATE`. Αυτό επιτρέπει την απρόσκοπτη ενημέρωση της βάσης καθώς προστίθενται νέες καφετέριες.

### 2. Γεωχωρική Αρχιτεκτονική Βάσης Δεδομένων (PostGIS)
Η εύρεση καφετεριών εντός μιας συγκεκριμένης προβολής χάρτη απαιτεί εξαιρετικά βελτιστοποιημένα ερωτήματα:
- **Spatial Data Types:** Η βάση αξιοποιεί το **PostGIS** extension για να αποθηκεύσει τις τοποθεσίες όχι απλώς ως αριθμούς, αλλά ως πραγματικά γεωγραφικά σημεία (`ST_SetSRID(ST_MakePoint(...))`).
- **Dynamic Bounding Box Queries:** Όταν ο χρήστης μετακινεί τον χάρτη στο frontend, ένα Python API endpoint λαμβάνει τις συντεταγμένες του χάρτη και τις μεταφράζει σε ένα εξαιρετικά αποδοτικό SQL ερώτημα χρησιμοποιώντας τις συναρτήσεις `ST_MakeEnvelope` και `ST_Within`. Αυτό επιτρέπει στη βάση να φιλτράρει αστραπιαία και να επιστρέφει μόνο τα σημεία που είναι ορατά στην οθόνη του χρήστη.

### 3. Αυτοματοποιημένη Συντήρηση Βάσης (`pg_cron`)
Για να αποτραπεί η αναστολή λειτουργίας (suspension) της cloud βάσης δεδομένων λόγω αδράνειας (στο free-tier), υλοποίησα ένα αυτοματοποιημένο job συντήρησης με μηδενικό κόστος:
- **`sql/006_prevent_idle.sql`**: Αυτό το script ενεργοποιεί το ενσωματωμένο extension `pg_cron` της PostgreSQL απευθείας μέσα στη βάση. Προγραμματίζει ένα ελαφρύ, αυτοματοποιημένο task (`SELECT 1;`) να τρέχει καθημερινά τα μεσάνυχτα. Αυτό αποδεικνύει βαθιά κατανόηση των database-level cron jobs και της διαχείρισης πόρων διακομιστή (server resource management).

### 4. Υψηλής Απόδοσης API (FastAPI)
- Ολόκληρο το backend έχει κατασκευαστεί με το **FastAPI** της Python, γνωστό για την ταχύτητά του και τις ασύγχρονες δυνατότητές του.
- Χρησιμοποιεί το **Pydantic V2** για αυστηρή επικύρωση (validation) όλων των εισερχόμενων συντεταγμένων και των εξερχόμενων δεδομένων, διασφαλίζοντας ότι το frontend δεν λαμβάνει ποτέ ελαττωματικά δεδομένα.
- Ο κώδικας ακολουθεί τη φιλοσοφία **Domain-Driven Design**, διαχωρίζοντας καθαρά τα API routes, τη λογική εφαρμογής (business logic), και τα μοντέλα της βάσης δεδομένων, εξασφαλίζοντας μέγιστη επεκτασιμότητα.

---

## 🏗 Πλήρες Tech Stack

### Backend
- **Γλώσσα Προγραμματισμού:** Python 3
- **Framework:** FastAPI
- **Βάση Δεδομένων:** PostgreSQL (hosted στο Supabase)
- **Geospatial Engine:** PostGIS
- **ORM:** SQLAlchemy 2.0 & GeoAlchemy2

### Frontend
- **Framework:** Next.js (React) / App Router
- **Map Integration:** Mapbox GL JS μέσω του `react-map-gl`
- **Styling:** Tailwind CSS (Custom Design System, Glassmorphism)
- **Εικονίδια:** Lucide React

---

## 🚀 Οδηγίες Εγκατάστασης (Getting Started)

### 1. Στήσιμο Βάσης Δεδομένων
Βεβαιωθείτε ότι έχετε μια βάση PostgreSQL με το PostGIS extension ενεργοποιημένο (π.χ. μέσω Supabase).
Εκτελέστε τα αρχικά scripts χρησιμοποιώντας τα Python runners:
```bash
cd backend
python run_seed_4.py # Δημιουργεί το schema και τις αρχικές καφετέριες
python run_seed_5.py # Προσθέτει συμπληρωματικά δεδομένα
python run_seed_6.py # Ενεργοποιεί το pg_cron task για αποτροπή αδράνειας
```

### 2. Στήσιμο Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Ρύθμιση μεταβλητών περιβάλλοντος (αντιγράψτε το .env.example στο .env και προσθέστε το DB URL σας)
cp .env.example .env

# Εκκίνηση του FastAPI server
uvicorn app.main:app --reload --port 8000
```
Το Documentation του API παράγεται αυτόματα στο: `http://localhost:8000/docs`

### 3. Στήσιμο Frontend
```bash
cd frontend
npm install

# Ρύθμιση μεταβλητών περιβάλλοντος (αντιγράψτε το .env.local.example στο .env.local και προσθέστε το Mapbox token σας)
cp .env.local.example .env.local

# Εκκίνηση του Next.js development server
npm run dev
```
Ανοίξτε το `http://localhost:3000` στον browser σας.

---
*Σχεδιάστηκε και αναπτύχθηκε ως ένα ολοκληρωμένο portfolio piece, αναδεικνύοντας γνώσεις αρχιτεκτονικής scalable backend, επάρκεια στην SQL, και premium frontend εκτέλεση.*
