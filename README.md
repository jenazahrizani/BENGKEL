# BENGKEL MALAM

### *Bangun. Racik. Jual. Gas.*

**Genre:** Garage Management + Vehicle Trading + Drag Racing
**Setting:** Kultur otomotif Indonesia fiktif
**Platform target:** Web / Mobile Web / Desktop
**Architecture target:** Astro-first, server-authoritative, modular, simple
**Core fantasy:** Memulai dari bengkel kecil, menemukan motor, memperbaikinya, membangunnya, mengelola joki, menerima order pelanggan, menjual motor, dan membawa hasil kerja bengkel ke lintasan.

---

# 0. DEFINISI PALING SINGKAT

> **BENGKEL MALAM adalah game manajemen bengkel otomotif berlatar kultur Indonesia, di mana pemain membangun bisnis melalui service, jual-beli motor, proyek rongsokan, modifikasi, perekrutan joki, serta balap drag dalam mode liaran dan resmi.**

Game tidak berusaha menjadi simulator kehidupan Indonesia.

Game juga tidak berusaha menjadi simulator mekanik profesional.

Game hanya ingin membuat pemain merasa:

> **“Ini bengkel saya. Motor ini hasil racikan saya. Joki ini saya kontrak. Race ini saya pilih. Kalau menang, semua keputusan saya terasa benar.”**

---

# 1. FANTASY PEMAIN

Pemain tidak terutama bermain sebagai pembalap.

Pemain bermain sebagai:

**pemilik bengkel yang memahami motor, bisnis, orang, dan balapan.**

Pada awal permainan:

```text
Bengkel kecil
1 mekanik
1 motor
modal terbatas
belum punya nama
```

Setelah berkembang:

```text
Bengkel terkenal
beberapa mekanik
beberapa motor
beberapa joki
customer tetap
sponsor
team
stock motor
project motor
official championship
nama besar
```

Pemain dapat memilih identitas ekonominya sendiri.

Misalnya:

```text
Dealer
Builder
Workshop Owner
Race Team
Project Hunter
Combination
```

Tidak ada class permanen.

---

# 2. CORE DESIGN PHILOSOPHY

BENGKEL MALAM dibangun dengan prinsip:

## Sedikit sistem, tetapi saling terhubung.

Jangan membuat:

```text
20 currency
30 reputation
50 NPC personality
100 resource
world simulation kompleks
```

Sebaliknya, gunakan:

```text
Money
Reputation
Motor
Parts
Joki
Customer
Race
Garage
```

lalu buat tujuh objek tersebut saling memengaruhi.

---

# 3. SACRED CORE

Lima hal tidak boleh dikorbankan selama development.

## 1. Motor harus terasa berharga.

Motor bukan angka.

Motor adalah aset.

## 2. Bengkel harus terasa hidup.

Pemain harus merasa sedang mengelola bisnis nyata dalam dunia game.

## 3. Uang harus selalu mempunyai keputusan.

Pemain tidak boleh terlalu cepat mempunyai uang berlebih.

## 4. Balapan harus menyenangkan.

Minigame merupakan payoff dari semua preparation.

## 5. Build harus menghasilkan cerita.

Motor murah yang berhasil dibangun dan kemudian menang harus terasa memorable.

---

# 4. CORE LOOP

Core loop resmi:

```text
FIND
  ↓
BUY
  ↓
REPAIR
  ↓
BUILD
  ↓
TEST
  ↓
RACE / SELL
  ↓
EARN
  ↓
REINVEST
  ↓
GROW GARAGE
```

Customer loop:

```text
CUSTOMER
  ↓
REQUEST
  ↓
PLAN BUILD
  ↓
USE PARTS
  ↓
FINISH
  ↓
PAYMENT
  ↓
REPUTATION
  ↓
MORE CUSTOMERS
```

Joki loop:

```text
SCOUT
  ↓
SIGN
  ↓
ASSIGN
  ↓
RACE
  ↓
RESULT
  ↓
EXPERIENCE
  ↓
VALUE
```

Race loop:

```text
CHOOSE EVENT
  ↓
CHOOSE MOTOR
  ↓
CHOOSE JOKI
  ↓
CHECK SETUP
  ↓
DRIVE
  ↓
RESULT
  ↓
REWARD / CONSEQUENCE
```

---

# 5. GAME LOOP TERBESAR

Seluruh game sebenarnya hanya:

```text
BENGKEL
   ↓
MOTOR
   ↓
BUILD
   ↓
BUSINESS
   ↓
RACE
   ↓
REPUTATION
   ↓
MONEY
   ↓
BENGKEL
```

Itulah jantung game.

---

# 6. DUNIA GAME

Dunia tidak perlu open world.

Gunakan beberapa hub sederhana.

```text
KOTA
│
├── BENGKEL
├── PASAR MOTOR
├── RONGSOKAN
├── TOKO PART
├── EVENT LIAR
├── SIRKUIT RESMI
├── SHOWROOM
└── KOMUNITAS
```

Secara gameplay semua cukup berupa halaman/interaksi.

Tidak diperlukan character walking atau open-world navigation pada MVP.

---

# 7. BENGKEL ADALAH HOME BASE

Bengkel adalah halaman utama.

Contoh:

```text
BENGKEL MALAM

Cash
Rp 18.400.000

Reputation
43

Garage
Level 2

MOTOR
3 / 4

ACTIVE ORDERS
2 / 2

NEXT EVENT
Malang Night Sprint
```

Kemudian:

```text
[ MOTOR ]
[ ORDER ]
[ RACE ]
[ MARKET ]
[ TEAM ]
```

Pemain harus selalu merasa kembali ke tempat yang sama.

---

# 8. GARAGE PROGRESSION

Gunakan hanya lima tingkat.

```text
LEVEL 1
GARASI KECIL

LEVEL 2
BENGKEL

LEVEL 3
PERFORMANCE SHOP

LEVEL 4
RACING WORKSHOP

LEVEL 5
ELITE GARAGE
```

Setiap level menaikkan kapasitas.

Contoh:

| Level | Motor | Order | Joki | Staff | Unlock           |
| ----- | ----: | ----: | ---: | ----: | ---------------- |
| 1     |     2 |     1 |    1 |     1 | Liar Basic       |
| 2     |     4 |     2 |    2 |     2 | Official Street  |
| 3     |     6 |     3 |    3 |     3 | Pro Parts        |
| 4     |     8 |     4 |    4 |     4 | Pro Championship |
| 5     |    10 |     6 |    6 |     5 | Elite Content    |

Tidak perlu building tree besar.

---

# 9. MOTOR SEBAGAI ASET UTAMA

Setiap motor adalah entity.

Motor mempunyai:

```text
ID
Model
Year / Generation
Condition
Power
Acceleration
Grip
Reliability
Build Score
Market Value
Original Cost
Current Value
Owner
History
Installed Parts
```

---

# 10. MOTOR TIDAK HARUS DIMULAI SEBAGAI MOTOR BAGUS

Ada tiga kualitas awal:

```text
STOCK
USED
PROJECT
```

## STOCK

Motor siap digunakan.

Condition tinggi.

Harga mahal.

## USED

Motor bekas.

Harga lebih murah.

Condition menengah.

## PROJECT

Motor rusak/rongsokan.

Harga sangat murah.

Memerlukan restoration dan parts.

---

# 11. MOTOR MARKET

Pasar motor berisi beberapa listing setiap periode.

Contoh:

```text
198 Street
Condition 91%
Price Rp 14M

Kupra 125
Condition 68%
Price Rp 8M

RX Project
Condition 27%
Price Rp 3.5M
```

Inventory market di-refresh secara terjadwal.

Tidak perlu real-time market simulation.

---

# 12. RONGSOKAN

Menu khusus:

# RONGSOKAN

Ini adalah salah satu signature feature game.

Pemain melihat project seperti:

```text
PROJECT #042

Frame       GOOD
Engine      POOR
Transmission MISSING
Body        POOR
Tire        POOR

Buy:
Rp 3.2M
```

Kemudian pemain dapat membeli.

Setelah dibeli:

```text
PROJECT
↓
RESTORE
↓
BUILD
↓
TEST
↓
KEEP / RACE / SELL
```

---

# 13. WHY SALVAGE MATTERS

Rongsokan menciptakan kesempatan untuk menghasilkan cerita.

Contoh:

```text
Beli:
Rp 3M

Repair:
Rp 2M

Parts:
Rp 6M

Total:
Rp 11M

Final Value:
Rp 16M
```

Pemain merasa:

> “Saya menemukan project bagus.”

Bukan hanya:

> “Saya membeli upgrade +5.”

---

# 14. PART SYSTEM

Part dibatasi menjadi:

```text
ENGINE
ECU
TRANSMISSION
EXHAUST
TIRE
SUSPENSION
```

Enam kategori ini sudah cukup.

---

# 15. PART VARIABLES

Setiap part hanya memiliki:

```text
Power
Acceleration
Grip
Reliability
Price
Condition
Quality
```

Tidak perlu simulasi mekanik dunia nyata secara detail.

---

# 16. PART QUALITY

```text
POOR
COMMON
GOOD
EXCELLENT
MASTER
```

Quality meningkatkan performance dan value.

---

# 17. PART CONDITION

```text
0–100
```

Contoh:

```text
Engine Condition: 73%
```

Condition memengaruhi performance dan resale value.

---

# 18. PART TRADE-OFF

Part tidak selalu membuat semua angka naik.

Contoh:

```text
BIG BORE

Power       +12
Acceleration +5
Reliability -9
```

Sedangkan:

```text
STREET ECU

Power       +4
Acceleration +8
Reliability +2
```

Pemain harus memilih.

---

# 19. BUILD SCORE

Motor mempunyai satu angka agregat:

```text
BUILD SCORE
```

Misalnya:

```text
Build Score: 78
```

Build Score dihitung dari:

```text
Base Vehicle
+
Parts
+
Quality
+
Condition
+
Garage Capability
```

Build Score dipakai untuk membantu menentukan:

```text
Race eligibility
Market value
Customer output
Class
```

Tetapi race tetap menggunakan stat motor yang lebih spesifik.

---

# 20. MOTOR CLASS

Gunakan kelas sederhana:

```text
STREET
PRO
OPEN
```

Motor memiliki:

```text
Class Score
```

Contoh:

```text
Street:
0–79

Pro:
80–94

Open:
95+
```

Dengan demikian pemain tidak bisa memasukkan motor Open ke event Street.

---

# 21. MANUFACTURER / MODEL

Untuk mengurangi legal/licensing complexity, gunakan manufacturer dan model **fiktif**.

Contoh:

```text
NUSA
GARUDA
JATRA
ARUNA
MERAPI
```

Model:

```text
Nusa Sprint 125
Garuda RX 150
Jatra King 135
Aruna Classic 200
Merapi Twin
```

Ini memberi kebebasan balancing dan branding.

---

# 22. MODEL IDENTITY

Setiap model punya karakter.

Contoh:

### JATRA KING

```text
Acceleration ++
Grip +
Reliability ++
```

### GARUDA RX

```text
Power +++
Grip +
Reliability -
```

### NUSA SPRINT

```text
Balanced
Cheap
Easy to maintain
```

Dengan demikian model terasa berbeda tanpa database kompleks.

---

# 23. MOTOR HISTORY

Motor dapat mempunyai history ringan:

```text
Purchased
Restored
Modified
Raced
Won
Sold
```

Contoh:

```text
GARUDA RX #081

Purchased
Restored
3 Wins
1 Championship
Sold
```

History meningkatkan emotional value.

---

# 24. MOTOR RESALE VALUE

Harga motor dihitung berdasarkan:

```text
Base Value
+
Part Value
+
Condition
+
Build Quality
+
Race History
+
Market Modifier
```

Motor yang sukses bisa dijual lebih mahal.

---

# 25. MOTOR TRADING

Pemain dapat mencari margin.

Contoh:

```text
Buy Used
Rp 8M

Repair
Rp 1M

Sell
Rp 12M

Profit
Rp 3M
```

Ini merupakan gameplay sah, bukan side feature.

---

# 26. BUILD-TO-SELL

Pemain dapat membangun motor khusus untuk dijual.

Misalnya:

```text
CUSTOM STREET BUILD

Cost:
Rp 10M

Market:
Rp 15M
```

Pemain dapat memilih:

```text
Keep
Race
Sell
```

Ini membuat racing dan trading sama-sama valid.

---

# 27. CUSTOMER SYSTEM

Customer datang dengan permintaan.

Contoh:

> “Saya punya motor stock. Saya ingin build untuk Street.”

Order:

```text
Budget
Rp 5M

Target
Build Score ≥ 65

Deadline
2 Days
```

Pemain menentukan build.

---

# 28. CUSTOMER ORDER TYPES

Cukup enam:

```text
SERVICE
REPAIR
STREET BUILD
RACE BUILD
RESTORATION
TUNE
```

---

# 29. SERVICE

Service adalah income paling aman.

Contoh:

```text
Basic Service
Reward Rp 300K

Engine Tune
Reward Rp 700K

Full Service
Reward Rp 1.2M
```

Semakin tinggi Garage Level, semakin mahal order yang tersedia.

---

# 30. REPAIR

Repair digunakan untuk:

```text
Motor sendiri
Motor customer
Motor project
```

Jadi satu sistem repair dapat dipakai di seluruh game.

---

# 31. RESTORATION

Customer bisa datang membawa motor tua.

Request:

> “Tolong hidupkan lagi motor ini.”

Pemain harus:

```text
Repair
Replace Parts
Tune
Finish
```

Reward tinggi.

---

# 32. CUSTOMER SATISFACTION

Gunakan satu angka:

```text
Satisfaction 0–100
```

Dipengaruhi oleh:

```text
Result
Build Quality
Cost
Timeliness
```

Satisfaction tinggi:

```text
Reputation ↑
```

Satisfaction rendah:

```text
Reputation ↓
```

---

# 33. CUSTOMER REPUTATION LOOP

```text
Good Build
↓
Satisfied Customer
↓
Garage Reputation
↓
Better Customers
↓
Higher Budget Orders
↓
More Income
↓
Better Garage
```

Dengan satu angka saja kita sudah mendapatkan business progression.

---

# 34. MECHANIC SYSTEM

Staff bengkel tidak membutuhkan AI.

Setiap mechanic memiliki:

```text
Specialty
Skill
Salary
```

Specialty:

```text
ENGINE
ELECTRICAL
TUNING
GENERAL
```

---

# 35. MECHANIC VALUE

Contoh:

```text
DANI
Tuning 83
Salary Rp 800K / cycle
```

Mekanik dengan skill tinggi:

```text
Build Quality ↑
Failure Chance ↓
```

Sistem sangat simpel.

---

# 36. TEAM / JOKI

Joki merupakan bagian dari management.

Pemain dapat:

```text
SEARCH
SIGN
ASSIGN
TRAIN
RELEASE
```

---

# 37. JOKI DATA

Joki hanya membutuhkan:

```text
Reaction
Shift
Consistency
Trait
Salary
Race Fee
```

Contoh:

```text
BAYU

Reaction      84
Shift         79
Consistency   72

Trait:
Aggressive
```

---

# 38. JOKI TRAITS

Cukup lima:

```text
AGGRESSIVE
TECHNICAL
CONSISTENT
COMEBACK
ROOKIE
```

### Aggressive

Higher peak performance, greater mistake volatility.

### Technical

Strong on technical timing windows.

### Consistent

Lower variance.

### Comeback

Slight bonus when behind.

### Rookie

Cheap but weak.

---

# 39. SIGNING JOKI

Contoh:

```text
BAYU
Signing Fee:
Rp 2M

Race Fee:
Rp 300K
```

atau:

```text
REZA
Signing:
Rp 5M

Race:
Rp 500K
```

Joki mahal bukan otomatis selalu terbaik.

---

# 40. JOKI PROGRESSION

Tidak perlu skill tree.

Joki berkembang melalui:

```text
Races
Wins
Experience
```

Setelah milestone:

```text
Reaction +1
Shift +1
Consistency +1
```

Perkembangan lambat.

---

# 41. JOKI PUNYA REPUTASI

Gunakan satu angka:

```text
Driver Reputation
```

Joki terkenal:

```text
Customer interest ↑
Sponsor quality ↑
Signing price ↑
```

Ini menghubungkan joki ke bengkel.

---

# 42. RACE SYSTEM

Balap dibagi menjadi dua dunia:

# LIAR

dan

# RESMI

---

# 43. MODE LIAR

Mode Liar adalah event-based dan fiktif.

Tidak ada open-world chase.

Tidak ada simulasi polisi.

Tidak ada sistem kriminal kompleks.

Pemain melihat:

```text
TONIGHT'S CALLS
```

Contoh:

```text
Short Sprint
Stake 500K
Reward 2M

Night Challenge
Stake 1M
Reward 4M

High Stakes
Stake 3M
Reward 10M
```

---

# 44. MODE LIAR: KARAKTERISTIK

```text
Flexible
Fast
High variance
No championship
No strict class
High earning potential
```

Tujuannya:

> quick gameplay dan high-risk opportunity.

---

# 45. MODE RESMI

Mode resmi memiliki:

```text
Classes
Race Calendar
Points
Championship
Sponsors
Records
```

---

# 46. OFFICIAL CLASSES

Versi awal:

```text
STREET
PRO
OPEN
```

Tidak perlu lebih dari tiga sampai core loop terbukti.

---

# 47. OFFICIAL RACE WEEKEND

```text
QUALIFY
→
RACE
→
RESULT
→
POINTS
```

Namun MVP bisa langsung:

```text
RACE
→
RESULT
→
POINTS
```

Qualification ditambahkan belakangan.

---

# 48. CHAMPIONSHIP

Satu season:

```text
8 Races
```

Contoh:

```text
Race 1
Race 2
Race 3
Race 4
Race 5
Race 6
Race 7
Final
```

Poin:

```text
1st = 25
2nd = 18
3rd = 15
4th = 12
5th = 10
```

---

# 49. SEASON OBJECTIVE

Season membuat game tidak mudah tamat.

Pemain tidak mengejar:

> “Saya ingin Level 100.”

Pemain mengejar:

> **“Saya ingin memenangkan season ini.”**

Setelah season:

```text
Champion
Top 3
Mid Table
Relegated / Failed
```

kemudian season berikutnya.

---

# 50. WHY SEASON IS IMPORTANT

Tanpa season:

```text
Money
→ Upgrade
→ Better
→ Upgrade
→ Finished
```

Dengan season:

```text
Budget
+
Calendar
+
Class
+
Rival
+
Sponsor
+
Condition
=
Strategy
```

---

# 51. RIVAL SYSTEM

Tidak perlu player-versus-player realtime.

Gunakan AI rivals.

Setiap rival memiliki:

```text
Name
Team
Class
Performance
Consistency
```

Contoh:

```text
JAYA SPEED
Garage Reputation 51

Strong:
Short Track

Weak:
Long Track
```

---

# 52. RIVAL HISTORY

Simpan:

```text
Wins
Losses
Season Points
```

Sehingga pemain dapat memiliki rivalitas sederhana.

Contoh:

> “RACE 5 — kamu mengalahkan Jaya Speed untuk kedua kalinya.”

Tidak perlu relationship engine.

---

# 53. RACE TRACKS

Track cukup punya karakter.

```text
SHORT
MEDIUM
LONG
TECHNICAL
```

Track modifiers:

```text
Acceleration
Grip
Shift Difficulty
```

---

# 54. TRACK CONDITIONS

Optional tetapi sangat bagus:

```text
DRY
WET
NIGHT
```

Efeknya sederhana.

Contoh:

```text
Wet:
Grip importance ↑
```

Tidak perlu weather simulation.

---

# 55. RACE MINIGAME

Ini adalah mechanical core.

Urutan:

```text
READY
↓
LAUNCH
↓
SHIFT
↓
SHIFT
↓
SHIFT
↓
FINISH
```

Durasi:

```text
8–15 seconds
```

---

# 56. LAUNCH

Pemain menekan tombol pada timing tertentu.

Result:

```text
PERFECT
GOOD
LATE
MISS
```

---

# 57. SHIFT

RPM bergerak:

```text
LOW
────── OPTIMAL ──────
                    REDLINE
```

Pemain menekan Shift pada timing optimal.

Result:

```text
PERFECT
GOOD
LATE
OVERREV
```

---

# 58. DRIVER MEMPENGARUHI MINIGAME

Joki dengan Reaction tinggi:

```text
Launch window ↑
```

Joki dengan Shift tinggi:

```text
Shift window ↑
```

Consistency:

```text
Random variance ↓
```

Dengan demikian joki benar-benar berguna.

---

# 59. MOTOR JUGA MEMPENGARUHI MINIGAME

Motor:

```text
Acceleration
```

mempengaruhi launch.

Motor:

```text
Power
```

mempengaruhi high-speed phase.

Motor:

```text
Grip
```

mempengaruhi launch stability.

Motor:

```text
Reliability
```

mempengaruhi risk.

---

# 60. PLAYER SKILL + MANAGEMENT

Hasil akhir:

```text
MOTOR
+
JOKI
+
SETUP
+
PLAYER TIMING
+
SMALL RNG
```

Ini sangat penting.

Game tidak menjadi:

> “angka motor menentukan siapa menang.”

Tetapi juga tidak menjadi:

> “skill tangan menentukan semuanya.”

Keduanya harus berkontribusi.

---

# 61. RACE RISK

Pemain sebelum race memilih:

```text
SAFE
NORMAL
PUSH
```

## SAFE

```text
Minigame easier
Performance slightly lower
Reliability safe
```

## NORMAL

```text
Balanced
```

## PUSH

```text
Higher performance
Smaller timing window
Higher wear
```

Satu tombol ini menciptakan decision-making tambahan.

---

# 62. RACE CONDITION

Motor mengalami wear.

Setelah race:

```text
Condition
100 → 94
```

Race keras:

```text
100 → 84
```

Dengan demikian repair menjadi relevan.

---

# 63. BREAKDOWN

Jangan terlalu sering.

Hanya jika:

```text
Reliability sangat rendah
+
Push
+
Random check
```

Hasil:

```text
Normal:
Finish

Bad:
Performance penalty

Critical:
DNF
```

DNF menjadi memorable.

---

# 64. REPAIR LOOP

Setelah race:

```text
Garage
↓
Inspect
↓
Repair
```

Pemain harus mempertimbangkan:

> “Apakah saya repair sekarang atau simpan uang untuk membeli part?”

---

# 65. RACE REWARD

Balapan memberi:

```text
Money
Reputation
Championship Points
Joki Experience
Motor History
```

Tetapi balap bukan satu-satunya sumber money.

---

# 66. INCOME MODEL

Income harus datang dari beberapa sumber.

```text
SERVICE
BUILD
REPAIR
MOTOR SALES
RACING
SPONSOR
```

Dengan kontribusi yang berbeda.

Idealnya:

```text
Service
= low risk / low reward

Build
= medium risk / medium reward

Trading
= knowledge / medium-high reward

Race
= skill / high variance

Sponsor
= objective-based
```

---

# 67. ECONOMIC IDENTITY

Pemain bebas memilih:

### Workshop Specialist

Banyak customer.

### Dealer

Banyak jual-beli.

### Builder

Banyak project.

### Racing Garage

Banyak race.

### Hybrid

Semua sedikit.

Tidak ada pilihan “benar”.

---

# 68. PRICE ENGINE

Harga motor:

```text
Base Value
× Condition
× Build Quality
× Market Modifier
× History Modifier
```

Tidak perlu supply-demand simulation kompleks untuk MVP.

Market Modifier cukup berubah berdasarkan event/rotation.

---

# 69. SIMPLE MARKET SHOCKS

Kadang:

```text
POPULAR MODEL WEEK
```

sebuah model naik harga.

Atau:

```text
PROJECT WEEK
```

rongsokan menjadi lebih banyak.

Atau:

```text
RACE SEASON
```

motor tertentu lebih dicari.

Dengan ini market terasa hidup tanpa simulation engine.

---

# 70. SPONSOR

Sponsor adalah monetization/progression layer dalam game.

Jenis sponsor:

```text
LOCAL
REGIONAL
NATIONAL
```

---

# 71. SPONSOR CONTRACT

Contoh:

```text
SPONSOR:
NUSA OIL

Duration:
4 races

Objective:
Finish Top 5 × 3

Reward:
Rp 8M
```

Atau:

```text
SPONSOR:
GARUDA PARTS

Objective:
Complete 5 customer builds

Reward:
Discount Parts
```

---

# 72. SPONSOR TRADE-OFF

Sponsor jangan memberi uang gratis.

Misalnya:

```text
Sponsor A
Easy objective
Low reward

Sponsor B
Hard objective
High reward
```

Pemain memilih.

---

# 73. GARAGE REPUTATION

Gunakan satu angka:

```text
0–100
```

Naik dari:

```text
Race Results
Customer Satisfaction
Motor Sales
Build Quality
```

---

# 74. REPUTATION TIERS

```text
UNKNOWN
LOCAL
KNOWN
ESTABLISHED
RESPECTED
RENOWNED
LEGENDARY
```

Reputation membuka konten.

---

# 75. REPUTATION BUKAN POWER LANGSUNG

Reputation sebaiknya membuka:

```text
Better customers
Better sponsor
Better race
Better market offers
Better drivers
```

Bukan:

```text
+20 damage
```

Dengan demikian progression tetap terasa natural.

---

# 76. GARAGE SPECIALIZATION

Tidak perlu skill tree besar.

Pada Level 3+, pemain memilih satu specialty sementara:

```text
PERFORMANCE
TRADING
RACING
SERVICE
```

Ini hanya memberi bonus kecil.

Contoh:

### Performance

Build cost -5%.

### Trading

Resale value +5%.

### Racing

Race repair cost -5%.

### Service

Customer satisfaction +5%.

Pemain masih bebas melakukan semuanya.

---

# 77. GARAGE CUSTOMIZATION

Visual progression:

```text
Level 1
Workshop kecil

Level 2
Tool wall

Level 3
Vehicle lift

Level 4
Race room

Level 5
Showroom
```

Pemain dapat menambah:

```text
Trophy
Poster
Sponsor Banner
Neon
Parts Rack
Motor Display
```

Tidak perlu decoration placement engine rumit pada MVP.

---

# 78. TANGIBLE PROGRESS

Setiap upgrade harus terlihat.

Contoh:

```text
Garage Level 1
= sempit

Garage Level 3
= penuh motor

Garage Level 5
= professional
```

Ini lebih satisfying daripada hanya:

```text
Garage Level:
3 → 4
```

---

# 79. DAILY / SESSION STRUCTURE

Game tidak perlu Energy.

Game tidak perlu Nerve.

Game tidak perlu Action Points.

Pemain dapat terus bermain.

Tetapi aktivitas memiliki konteks:

```text
Customer slots
Market refresh
Race schedule
Garage capacity
Money
Condition
```

Jadi pemain tidak dihentikan oleh stamina, tetapi keputusan tetap terbatas.

---

# 80. OFFLINE PROGRESSION

Background hanya untuk hal yang memang masuk akal:

```text
Customer order completion
Simple repairs
Sponsor cycle
Market refresh
```

Contoh:

> Customer build selesai dalam 30 menit.

Pemain boleh keluar dari game.

Saat kembali:

```text
Order Completed
Rp 2.4M earned
```

Tidak perlu worker architecture kompleks untuk MVP.

---

# 81. NOTIFICATION SYSTEM

Notifikasi hanya untuk:

```text
ORDER COMPLETE
RACE STARTING
SPONSOR UPDATE
MOTOR SOLD
MARKET REFRESH
```

Jangan spam pemain.

---

# 82. PLAYER PROFILE

Profile cukup:

```text
Garage Name
Reputation
Garage Level
Race Wins
Championships
Cars/Motor Collection
Total Sales
Customer Builds
```

---

# 83. GARAGE RECORDS

Profile juga bisa menampilkan:

```text
Most Expensive Build
Most Expensive Sale
Most Successful Motor
Most Used Joki
Biggest Race Win
```

Ini membuat history tetap terasa tanpa database history raksasa.

---

# 84. ACHIEVEMENTS

Gunakan sedikit.

Contoh:

```text
FIRST BUILD
FIRST SALE
FIRST WIN
FIRST CHAMPIONSHIP
FIRST 10 CUSTOMERS
FIRST PROJECT PROFIT
FIRST SPONSOR
```

Reward berupa:

```text
Badge
Title
Cosmetic
Small unlock
```

Tidak perlu achievement tree besar.

---

# 85. SEASON FINALE

Di akhir season:

```text
Championship Result
Sponsor Result
Garage Growth
Motor Sales
Customer Rating
```

Kemudian:

```text
NEW SEASON
```

Pemain membawa:

```text
Garage
Money
Motors
Joki
Reputation
History
```

---

# 86. MENGAPA GAME TIDAK CEPAT SELESAI?

Karena tidak ada “final upgrade”.

Ada beberapa layer tujuan:

```text
Build a profitable garage
↓
Win races
↓
Move into higher class
↓
Get better customers
↓
Build valuable motors
↓
Sign better joki
↓
Win championship
↓
Repeat under harder economic conditions
```

Tujuannya bukan unlock semua.

Tujuannya:

> **membangun bengkel dengan identitas dan sejarah.**

---

# 87. DIFFICULTY CURVE

Jangan menaikkan harga secara brutal.

Naikkan melalui kombinasi:

```text
Higher race competition
Smaller margins
Higher part prices
Harder customer requirements
Higher sponsor objectives
```

Contoh:

Early game:

```text
Profit:
Rp 500K–2M
```

Mid game:

```text
Profit:
Rp 2M–10M
```

Late game:

```text
Profit:
Rp 10M+
```

Tetapi cost juga meningkat.

---

# 88. MONEY SINK

Setiap income membutuhkan sink.

Sink utama:

```text
Motor Purchase
Parts
Repair
Mechanic Salary
Joki Fee
Race Entry
Garage Upgrade
Sponsor-related Costs
```

Tidak perlu pajak kompleks.

---

# 89. ECONOMIC SAFETY

Backend harus memastikan:

```text
Money cannot become negative accidentally.
```

Semua transaction melalui server.

Contoh:

```text
BUY MOTOR
→ CHECK MONEY
→ DEDUCT
→ CREATE MOTOR
→ CREATE TRANSACTION
```

Bukan:

```text
client:
money -= price
```

---

# 90. TRANSACTION LEDGER

Setiap perubahan uang masuk ledger:

```text
id
player_id
type
amount
balance_before
balance_after
reference_id
created_at
```

Contoh:

```text
SALE
+4,000,000

PART_PURCHASE
-1,200,000

RACE_REWARD
+3,000,000
```

Ini cukup untuk menjaga ekonomi sehat.

---

# 91. SIMPLE SERVER AUTHORITY

Browser hanya berkata:

```text
I want to buy this motor.
```

Server menentukan:

```text
Is motor available?
Does player have money?
Is garage capacity available?
Is transaction valid?
```

Sama untuk:

```text
Race
Buy Part
Sell Motor
Hire Joki
Complete Order
```

---

# 92. DATA VS LOGIC

Pisahkan:

```text
DATA
```

dan:

```text
RULE
```

Contoh:

`data/motors.ts`

menyimpan:

```text
model
baseStats
price
class
```

Sedangkan:

`game/motor.ts`

menentukan:

```text
calculateValue()
calculatePerformance()
```

Dengan demikian content mudah ditambah.

---

# 93. CORE GAME MODULES

Saya sarankan hanya:

```text
motor.ts
parts.ts
build.ts
garage.ts
customer.ts
driver.ts
race.ts
market.ts
sponsor.ts
progression.ts
```

Tidak lebih dari itu untuk core.

---

# 94. PROJECT STRUCTURE FINAL

```text
bengkel-malam/
│
├── src/
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── garage.astro
│   │   ├── motor.astro
│   │   ├── market.astro
│   │   ├── rongsokan.astro
│   │   ├── customers.astro
│   │   ├── team.astro
│   │   ├── races.astro
│   │   ├── sponsors.astro
│   │   ├── profile.astro
│   │   └── race/
│   │       └── [raceId].astro
│   │
│   ├── components/
│   │   │
│   │   ├── ui/
│   │   ├── garage/
│   │   ├── motor/
│   │   ├── market/
│   │   ├── customer/
│   │   ├── team/
│   │   ├── race/
│   │   └── sponsor/
│   │
│   ├── lib/
│   │   │
│   │   ├── game/
│   │   │   ├── motor.ts
│   │   │   ├── parts.ts
│   │   │   ├── build.ts
│   │   │   ├── garage.ts
│   │   │   ├── customer.ts
│   │   │   ├── driver.ts
│   │   │   ├── race.ts
│   │   │   ├── market.ts
│   │   │   ├── sponsor.ts
│   │   │   └── progression.ts
│   │   │
│   │   ├── data/
│   │   │   ├── motors.ts
│   │   │   ├── parts.ts
│   │   │   ├── drivers.ts
│   │   │   ├── races.ts
│   │   │   ├── sponsors.ts
│   │   │   └── customers.ts
│   │   │
│   │   └── server/
│   │       ├── auth.ts
│   │       ├── player.ts
│   │       └── save.ts
│   │
│   └── styles/
│       ├── global.css
│       └── game.css
│
├── public/
│   ├── images/
│   │   ├── motors/
│   │   ├── parts/
│   │   ├── garage/
│   │   └── races/
│   └── sounds/
│
├── drizzle/
│
├── scripts/
│   └── seed.ts
│
├── tests/
│   ├── motor.test.ts
│   ├── build.test.ts
│   ├── market.test.ts
│   ├── customer.test.ts
│   └── race.test.ts
│
├── astro.config.mjs
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

# 95. DATABASE FINAL

MVP database:

```text
users
players
garages
motors
parts
motor_parts
drivers
driver_contracts
customers
customer_orders
races
race_results
sponsors
sponsor_contracts
transactions
```

Hanya sekitar 16 tabel.

---

# 96. PLAYERS

```text
id
user_id
garage_id
name
cash
reputation
garage_level
created_at
updated_at
```

---

# 97. GARAGES

```text
id
player_id
level
motor_capacity
order_capacity
driver_capacity
mechanic_capacity
created_at
updated_at
```

---

# 98. MOTORS

```text
id
player_id
model_id
name
condition
build_score
market_value
race_wins
race_starts
created_at
updated_at
```

---

# 99. PARTS

```text
id
model
category
quality
power_modifier
acceleration_modifier
grip_modifier
reliability_modifier
base_price
```

---

# 100. MOTOR PARTS

```text
id
motor_id
part_id
condition
installed_at
```

---

# 101. DRIVERS

```text
id
name
reaction
shift
consistency
trait
signing_fee
race_fee
reputation
```

---

# 102. DRIVER CONTRACTS

```text
id
player_id
driver_id
status
signed_at
expires_at
```

---

# 103. CUSTOMER ORDERS

```text
id
player_id
customer_name
type
motor_id
budget
target_score
deadline
reward
status
satisfaction
```

---

# 104. RACES

```text
id
name
mode
class
distance
difficulty
entry_fee
prize
track_type
condition
```

---

# 105. RACE RESULTS

```text
id
player_id
race_id
motor_id
driver_id
finish_time
position
points
reward
created_at
```

---

# 106. SPONSORS

```text
id
name
tier
```

---

# 107. SPONSOR CONTRACTS

```text
id
player_id
sponsor_id
objective_type
objective_value
progress
reward
status
```

---

# 108. GAME CONTENT

Content sebaiknya seluruhnya data-driven.

Contoh motor:

```ts
{
  id: "nusa-sprint-125",
  name: "Nusa Sprint 125",
  class: "STREET",
  basePrice: 8000000,
  power: 58,
  acceleration: 71,
  grip: 69,
  reliability: 82
}
```

Dengan struktur seperti ini menambahkan motor baru tidak membutuhkan perubahan engine.

---

# 109. RACE DATA

```ts
{
  id: "kediri-night",
  name: "Kediri Night Sprint",
  mode: "LIAR",
  class: null,
  distance: "SHORT",
  difficulty: 2,
  entryFee: 500000,
  prize: 2500000
}
```

Official:

```ts
{
  id: "regional-street-01",
  name: "Regional Street Round 1",
  mode: "OFFICIAL",
  class: "STREET",
  distance: "MEDIUM",
  difficulty: 3,
  entryFee: 1000000,
  prize: 5000000
}
```

---

# 110. RECOMMENDED UI STRUCTURE

Bottom navigation:

```text
GARAGE
MOTOR
MARKET
RACE
TEAM
```

Top bar:

```text
Garage Name
Cash
Reputation
```

Ini lebih bagus daripada sidebar kompleks untuk versi awal.

---

# 111. GARAGE SCREEN

Harus menunjukkan:

```text
Cash
Reputation
Garage Level
Active Orders
Motor Condition Alerts
Next Race
```

Kemudian shortcut:

```text
BUY MOTOR
OPEN RONGSOKAN
CUSTOMER ORDERS
RACE TONIGHT
```

---

# 112. MOTOR SCREEN

Motor card:

```text
JATRA KING 135

Condition 84%

Power       72
Accel       81
Grip        69
Reliability 77

Build Score
78
```

Actions:

```text
VIEW
BUILD
REPAIR
RACE
SELL
```

---

# 113. MOTOR DETAIL

Tab:

```text
OVERVIEW
PARTS
HISTORY
VALUE
```

Jangan lebih banyak.

---

# 114. MARKET SCREEN

Tab:

```text
MOTOR
PARTS
RONGSOKAN
MY LISTINGS
```

---

# 115. CUSTOMER SCREEN

Card:

```text
ORDER #042

Street Build
Budget:
Rp 6M

Target:
Score 72+

Reward:
Rp 8M

Deadline:
1d 4h
```

Action:

```text
ACCEPT
```

Setelah diterima:

```text
BUILD
```

---

# 116. TEAM SCREEN

```text
JOKI

Bayu
84 / 79 / 72

Reza
76 / 81 / 88
```

Action:

```text
RACE
TRAIN
DETAIL
RELEASE
```

---

# 117. RACE SCREEN

Sebelum race:

```text
EVENT

Kediri Night Sprint
LIAR

Entry:
Rp 500K

Reward:
Rp 2.5M

Your Motor:
Jatra King

Your Driver:
Bayu
```

Tombol:

```text
RACE
```

---

# 118. PRE-RACE DECISION

Sebelum mulai:

```text
SETUP

SAFE
NORMAL
PUSH
```

Dan:

```text
Choose Motor
Choose Driver
```

Sederhana tetapi bermakna.

---

# 119. RACE RESULT SCREEN

```text
FINISH

1st
BENGKEL MALAM

Time
8.421s

Reward
Rp 2.500.000

Reputation
+3

Motor Condition
92 → 86
```

Kemudian:

```text
RACE AGAIN
GARAGE
```

---

# 120. VISUAL IDENTITY

Saya akan menjauh dari tampilan sci-fi/military IRONBOUND.

BENGKEL MALAM sebaiknya:

```text
Concrete
Metal
Rubber
Grease
Sticker
Receipt
Race Number
Workshop Sign
Neon
Night Street
Paddock
```

Warna dasar:

```text
Charcoal
Off-white
Silver
Warm orange
Deep red
Occasional lime / electric accent
```

Tidak harus semuanya terang.

---

# 121. UI AESTHETIC

UI dapat terinspirasi dari:

```text
Bengkel board
Nota
Pit board
Race timing sheet
Price tag
Part packaging
Garage signage
```

Bukan dashboard corporate.

---

# 122. INDONESIAN CULTURE

Culture bukan sistem besar.

Culture masuk melalui:

```text
Nama bengkel
Nama joki
Nama event
Dialog
Poster
Stiker
Warung
Bendera
Musik
Bahasa
Komunitas
Sponsor fiktif
```

Dengan demikian game terasa Indonesia tanpa membutuhkan simulasi budaya kompleks.

---

# 123. DIALOG

Dialog harus pendek dan natural.

Contoh:

> “Mas, ini motornya jangan dibikin terlalu liar. Saya masih mau dipakai harian.”

Atau:

> “Ada project masuk. Mesinnya belum hidup, tapi frame-nya lumayan.”

Atau:

> “Malam ini kelas Street ramai.”

Dialog hanya memberi flavor.

---

# 124. TONE

Tone:

```text
Hangat
Lokal
Kompetitif
Sedikit kasar
Humor ringan
Workshop culture
```

Bukan:

```text
grim
violent
military
cyberpunk
```

---

# 125. LIAR MODE — SAFETY DESIGN

Mode liaran sebaiknya dibuat sebagai **event balap fiksi yang diabstraksikan**, bukan tutorial balap jalanan dunia nyata.

Game fokus pada:

```text
Entry
Setup
Timing
Competition
Reward
```

Bukan:

```text
Cara menghindari aparat
Cara memilih jalan nyata
Cara menyelenggarakan street race
Cara melanggar hukum
```

Ini sekaligus menjaga desain tetap sederhana.

---

# 126. NO OPEN WORLD

Jangan membuat:

```text
walking
driving around city
police chase
traffic simulation
garage navigation
```

Minimal untuk MVP.

Event cukup berupa UI card.

Ini menghemat development luar biasa besar.

---

# 127. NO REAL-TIME MULTIPLAYER PADA MVP

Mulai dengan:

```text
AI rivals
```

Kemudian leaderboard asynchronous:

```text
Best Time
Best Garage
Best Season
```

Baru setelah game terbukti menyenangkan, pertimbangkan PvP.

---

# 128. ASYNC MULTIPLAYER

Versi lanjutan:

Pemain mengunggah record.

Misalnya:

```text
Regional Street

1. GARASI MALAM — 8.214
2. JAYA SPEED — 8.239
3. WONG RACING — 8.247
```

Pemain tidak perlu online pada waktu yang sama.

Sangat murah dibanding realtime multiplayer.

---

# 129. WHY ASYNC IS FITTING

Karena game sebenarnya tentang:

```text
management
planning
collection
business
optimization
```

bukan:

```text
real-time MMO combat
```

---

# 130. GAMEPLAY GENERATOR

Konten baru seharusnya mudah dibuat.

Untuk membuat race baru hanya butuh:

```text
name
mode
class
difficulty
track type
entry
reward
```

Untuk customer baru:

```text
name
order type
budget
target
reward
```

Untuk motor baru:

```text
model
base stats
price
class
```

Untuk joki:

```text
name
stats
trait
price
```

Dengan begitu content production menjadi murah.

---

# 131. RANDOMIZATION

Random hanya digunakan untuk menciptakan variasi.

Misalnya market:

```text
5 motor
10 parts
3 projects
```

dipilih dari pool.

Customer:

```text
random requirement
random budget
random target
```

Race:

```text
rotating event
```

Namun core rules tetap deterministic.

---

# 132. DETERMINISTIC RACE ENGINE

Race sebaiknya menggunakan seed agar hasil dapat dipertanggungjawabkan.

Secara konsep:

```text
Race Seed
+
Motor State
+
Driver State
+
Player Input
=
Race Result
```

Ini juga membantu debugging.

---

# 133. RACE FORMULA SEDERHANA

Model konseptual:

```text
Base Time

- Acceleration Modifier
- Power Modifier
- Grip Modifier

- Launch Performance
- Shift Performance

+ Track Modifier
+ Condition Modifier
+ Small Variance
```

Tidak perlu physics engine.

---

# 134. MARKET FORMULA

```text
Market Value =
Base Value
× Condition Modifier
× Build Modifier
× History Modifier
× Market Modifier
```

---

# 135. BUILD FORMULA

```text
Build Score =
Base Vehicle
+
Installed Part Score
+
Quality Bonus
+
Condition Bonus
+
Mechanic Bonus
```

---

# 136. CUSTOMER FORMULA

```text
Customer Satisfaction =
Target Met
+
Build Quality
+
On Time
-
Overbudget
```

Kemudian clamp:

```text
0–100
```

---

# 137. GARAGE REPUTATION FORMULA

Reputation berubah perlahan.

```text
Customer Result
→ ±1 to ±3

Race Result
→ ±1 to ±5

Major Championship
→ ±5 to ±10

Bad Order
→ -1 to -4
```

Jangan biarkan satu race langsung mengubah reputasi dari 20 menjadi 80.

---

# 138. PROGRESSION PHILOSOPHY

Progression utama:

```text
GARAGE
```

Bukan:

```text
PLAYER LEVEL
```

Pemain tidak perlu merasa:

> “Saya level 33.”

Pemain harus merasa:

> “Bengkel saya sudah kelas regional.”

---

# 139. EARLY GAME

Fokus:

```text
Service
Used Motor
Basic Parts
Basic Liar
First Customer
First Joki
```

Tujuan:

> menghasilkan modal.

---

# 140. MID GAME

Masuk:

```text
Project
Better Joki
Official Street
Sponsors
Motor Trading
Performance Parts
```

Tujuan:

> membangun identitas garage.

---

# 141. LATE GAME

Masuk:

```text
Pro
Open
Championship
Elite Sponsor
Rare Project
High-value Builds
Garage Collection
```

Tujuan:

> menjadi garage besar.

---

# 142. ENDGAME

Endgame bukan “finish”.

Endgame:

```text
Championship
Rare Motor Collection
Build Mastery
Profit
Garage Reputation
Joki Legacy
Race Records
```

Pemain terus membangun sejarah.

---

# 143. LOOP EKONOMI TERBAIK

```text
RONGSOKAN
↓
PROJECT
↓
REPAIR
↓
BUILD
↓
TEST
↓
SELL
↓
PROFIT
↓
BUY BETTER PROJECT
```

Ini harus menjadi salah satu loop paling memuaskan di game.

---

# 144. LOOP RACING TERBAIK

```text
BUILD
↓
CHOOSE CLASS
↓
CHOOSE RACE
↓
CHOOSE JOKI
↓
SAFE / NORMAL / PUSH
↓
MINIGAME
↓
RESULT
↓
MONEY + REPUTATION
```

---

# 145. LOOP CUSTOMER TERBAIK

```text
CUSTOMER
↓
REQUEST
↓
SELECT PART
↓
BUILD
↓
DELIVER
↓
PAYMENT
↓
REPUTATION
↓
BETTER ORDER
```

---

# 146. LOOP TEAM TERBAIK

```text
SCOUT JOKI
↓
SIGN
↓
ASSIGN MOTOR
↓
RACE
↓
RESULT
↓
EXPERIENCE
↓
BETTER PERFORMANCE
↓
BETTER RACE
```

---

# 147. CONTOH SATU HARI

Pemain login.

```text
Cash:
Rp 11M

Reputation:
34
```

Dashboard menunjukkan:

```text
Customer order selesai.
Market refresh.
Official race malam ini.
```

Pemain membuka market.

Ada:

```text
RX Project
Rp 3M
Condition 28%
```

Pemain membeli.

Uang:

```text
Rp 8M
```

Customer masuk:

```text
Street Build
Budget Rp 5M
```

Pemain mengerjakan.

Reward:

```text
Rp 7M
```

Sekarang:

```text
Rp 15M
```

Malam:

```text
Official Street Race
```

Pemain memilih motor lama.

Memilih joki.

Memilih:

```text
PUSH
```

Minigame:

```text
Perfect Launch
Perfect Shift
Good Shift
Perfect Shift
```

Menang.

Reward:

```text
Rp 5M
Reputation +4
```

Pemain kembali ke Garage:

```text
Rp 20M
```

Kemudian memutuskan:

> “Saya mau bangun RX project.”

Itulah session yang ideal.

---

# 148. CONTOH KEPUTUSAN SULIT

Pemain memiliki:

```text
Rp 8M
```

Ada:

```text
Customer Order:
Rp 6M capital requirement

Rare Project:
Rp 5M

Race:
Entry Rp 1M
Prize Rp 7M
```

Pemain tidak dapat melakukan semuanya.

Pilihan:

```text
Customer
→ safe profit

Project
→ potential big profit

Race
→ potential big reward
```

Ini adalah bentuk difficulty yang kita inginkan.

Bukan:

> “Energy habis.”

---

# 149. ANTI-BOREDOM

Game menjadi membosankan kalau:

```text
buy strongest part
→ win
→ buy stronger part
```

Maka kita menggunakan:

```text
Budget
+
Class
+
Condition
+
Part Trade-off
+
Customer Demand
+
Race Type
+
Joki
+
Market Opportunity
```

Sistem sederhana tersebut menciptakan banyak keputusan.

---

# 150. ANTI-META

Tidak boleh ada:

> satu motor terbaik.

Karena:

```text
Short Race
≠
Long Race

Street
≠
Pro

Safe
≠
Push

Sell
≠
Race
```

Motor yang sangat bagus untuk race belum tentu bagus untuk dijual.

Motor yang bagus untuk dijual belum tentu ideal untuk championship.

---

# 151. PLAYER IDENTITY

Game secara otomatis bisa membaca profil pemain.

Misalnya:

```text
70% income dari sales
20% customer
10% race
```

Label:

> **DEALER GARAGE**

Atau:

```text
65% race
20% build
15% service
```

Label:

> **RACE GARAGE**

Label ini hanya flavor.

Tidak mengunci gameplay.

---

# 152. LEGACY

Setelah bermain lama:

```text
Garage Founded:
Season 1

Championships:
3

Motor Sold:
82

Customer Builds:
214

Race Wins:
48

Best Sale:
Rp 31M
```

Pemain mendapatkan rasa:

> “Ini bengkel yang saya bangun.”

---

# 153. MOTOR LEGACY

Contoh:

```text
GARUDA RX #017

Built in Season 2

Race Starts:
17

Wins:
9

Championship:
1

Sold:
Season 5
```

Motor lama menjadi cerita.

---

# 154. JOKI LEGACY

```text
BAYU

Races:
84

Wins:
31

Championships:
3

Garage:
Bengkel Malam
```

Ketika joki pensiun/released:

> historinya tetap tersimpan.

Tidak perlu simulation.

---

# 155. SPONSOR LEGACY

```text
Nusa Oil
Season 3–5
```

Pemain dapat melihat sponsor yang pernah bekerja sama.

---

# 156. SEASON ARCHIVE

Simpan hanya:

```text
Champion
Top 3
Player Position
Race Wins
Major Sponsor
```

Tidak perlu menyimpan setiap world event.

---

# 157. CONTENT TARGET VERSION 1.0

Target content:

```text
15 Motor Models
60–80 Parts
10 Joki
20 Customer Templates
15 Liar Events
15 Official Events
3 Classes
6 Tracks
10 Sponsors
5 Garage Levels
```

Jumlah ini sudah cukup besar untuk game awal tetapi masih manageable.

---

# 158. MVP

MVP harus jauh lebih kecil.

```text
3 Motor
10 Parts
2 Joki
3 Customer Orders
3 Liar Events
3 Official Events
1 Class
1 Garage Level
1 Rongsokan
1 Motor Market
1 Sponsor
1 Race Minigame
```

Core loop:

```text
BUY
→ BUILD
→ RACE
→ SELL
→ REPEAT
```

Kemudian customer masuk.

---

# 159. DEVELOPMENT ORDER

Jangan membuat semua halaman dahulu.

Urutan:

```text
1. Motor model
2. Part model
3. Build calculation
4. Race calculation
5. Race minigame
6. Money transaction
7. Garage
8. Market
9. Customer order
10. Joki
11. Sponsor
12. Official championship
```

Karena tanpa core gameplay, UI besar hanya menghasilkan prototype cantik yang belum playable.

---

# 160. MILESTONE 1 — PLAYABLE GARAGE

Harus sudah bisa:

```text
Create garage
Buy motor
Buy part
Install part
See stats
Sell motor
```

---

# 161. MILESTONE 2 — PLAYABLE RACE

Harus sudah bisa:

```text
Choose motor
Choose joki
Launch
Shift
Finish
Get result
Get money
```

---

# 162. MILESTONE 3 — BUSINESS

Tambahkan:

```text
Customer
Repair
Build Order
Profit
Reputation
```

---

# 163. MILESTONE 4 — CONTENT

Tambahkan:

```text
More motors
More parts
More races
Rongsokan
Sponsors
```

---

# 164. MILESTONE 5 — SEASON

Tambahkan:

```text
Official championship
Points
Rivals
Season results
```

Baru setelah ini game sudah menjadi versi yang benar-benar lengkap.

---

# 165. FEATURE FREEZE RULE

Setiap fitur baru harus menjawab:

```text
Apakah ini memperkuat bengkel?
Apakah ini memperkuat motor?
Apakah ini memperkuat racing?
Apakah ini memperkuat business?
```

Jika tidak:

> Jangan masukkan.

---

# 166. FITUR YANG TIDAK BOLEH MASUK TERLALU CEPAT

```text
Open world
Realtime multiplayer
Faction
Territory
Complex NPC AI
Police simulation
Complex crafting
Player housing
Multiple currencies
Huge skill tree
Vehicle physics
Trading economy realtime
```

Semua itu bisa menarik.

Tetapi semuanya memiliki cost development yang sangat besar dan tidak diperlukan untuk core fantasy.

---

# 167. SIMPLE IS NOT SHALLOW

Kedalaman BENGKEL MALAM berasal dari kombinasi:

```text
MOTOR
×
PART
×
JOKI
×
RACE
×
CUSTOMER
×
MONEY
×
TIMING
```

Misalnya satu motor:

```text
Street build
```

bisa digunakan untuk:

```text
Customer
Race
Sell
Trade
Collection
```

Satu object menghasilkan banyak gameplay.

---

# 168. DESIGN PRINCIPLE: OBJECT REUSE

Ini sangat penting untuk developer.

Jangan membuat sistem terpisah untuk:

```text
Race Motor
Customer Motor
Market Motor
Garage Motor
```

Harus hanya ada:

# MOTOR

Objek yang sama digunakan oleh semuanya.

Begitu juga:

# PART

Part digunakan oleh:

```text
Customer
Player
Market
Build
Sales
```

Dengan cara ini codebase tetap kecil.

---

# 169. ARCHITECTURE MENTAL MODEL

```text
              ┌──────────────┐
              │    ASTRO     │
              │     PAGES    │
              └──────┬───────┘
                     ↓
              ┌──────────────┐
              │ COMPONENTS   │
              │     UI       │
              └──────┬───────┘
                     ↓
              ┌──────────────┐
              │ GAME LIBRARY │
              │ RULES        │
              └──────┬───────┘
                     ↓
              ┌──────────────┐
              │   DATABASE   │
              └──────────────┘
```

Tidak perlu architecture enterprise.

---

# 170. DOMAIN BOUNDARY SEDERHANA

```text
motor.ts
→ motor rules

build.ts
→ build rules

race.ts
→ race rules

customer.ts
→ customer rules

market.ts
→ market rules

garage.ts
→ garage rules

driver.ts
→ joki rules

sponsor.ts
→ sponsor rules

progression.ts
→ progression rules
```

Selesai.

---

# 171. SERVER ACTION PATTERN

Contoh:

```text
POST /api/motor/buy
```

Server:

```text
authenticate
→ validate
→ check money
→ check capacity
→ purchase
→ save
→ transaction
→ return
```

Race:

```text
POST /api/race/start

authenticate
→ validate
→ check eligibility
→ create race session
→ return race seed
```

Finish:

```text
POST /api/race/finish

validate session
→ validate input
→ calculate result
→ save result
→ reward money
→ update reputation
→ update motor
```

---

# 172. CHEAT PREVENTION

Tidak boleh:

```text
client says:
"I won."
```

Client hanya mengirim input minigame.

Server menentukan:

```text
valid timing
race seed
motor
driver
result
reward
```

---

# 173. SAVE DESIGN

Player state harus mudah dipahami.

```text
Player
├── Garage
├── Money
├── Motors
├── Parts
├── Drivers
├── Orders
├── Sponsors
└── History
```

Tidak perlu event-sourcing penuh.

Ledger cukup untuk transaksi uang.

---

# 174. PERFORMANCE

Untuk awal:

```text
PostgreSQL-compatible database
Astro
Drizzle
Simple server actions / API
```

Tidak perlu Redis pada MVP.

Tidak perlu queue system.

Tidak perlu WebSocket.

Tambah hanya ketika benar-benar diperlukan.

---

# 175. BACKGROUND PROCESSING

MVP dapat menggunakan scheduled server job sederhana untuk:

```text
Expire customer orders
Refresh market
Generate events
Finish sponsor period
Advance seasons
```

Tidak perlu real-time simulation.

---

# 176. REALTIME REQUIREMENT

Hampir tidak ada.

UI dapat bekerja dengan:

```text
request
→ server
→ response
```

Race minigame dapat berjalan client-side, tetapi hasil divalidasi server.

---

# 177. SECURITY

Semua mutasi penting di server.

```text
Money
Motor ownership
Part ownership
Race result
Joki contract
Customer completion
Garage level
```

tidak boleh ditentukan client.

---

# 178. TESTING

Yang harus dites paling awal:

```text
Motor value
Build score
Race calculation
Transaction
Buy / Sell
Customer payout
Garage capacity
Class eligibility
```

Tidak perlu E2E untuk setiap fitur kecil.

---

# 179. BALANCING

Buat spreadsheet balancing sederhana.

Kolom:

```text
Motor
Base Price
Power
Accel
Grip
Reliability
Build Cost
Expected Sale
Race Value
```

Kemudian:

```text
Part
Cost
Performance
Reliability
```

Ini akan menjadi alat balancing utama.

---

# 180. CORE ECONOMIC PRINCIPLE

Setiap motor harus memiliki setidaknya tiga kemungkinan:

```text
USE
SELL
BUILD
```

Jika sebuah motor hanya bagus untuk satu hal, desain belum optimal.

---

# 181. CORE JOKI PRINCIPLE

Setiap joki harus memiliki:

```text
Strength
Weakness
Price
Identity
```

Tidak boleh semua joki hanya:

```text
75
76
77
78
```

Harus ada pilihan.

---

# 182. CORE RACE PRINCIPLE

Setiap race harus memberikan alasan untuk memilih.

Misalnya:

```text
Short
→ Acceleration

Long
→ Power

Wet
→ Grip

Technical
→ Joki technical
```

Dengan hanya empat track attributes, race variety sudah cukup.

---

# 183. CORE CUSTOMER PRINCIPLE

Order harus memaksa pemain memilih.

Contoh:

> Budget kecil tetapi target tinggi.

Pemain mungkin:

```text
Take risky parts
```

atau:

> Tolak order.

Choice itu lebih menarik daripada sekadar:

```text
Click Complete.
```

---

# 184. CORE MARKET PRINCIPLE

Tidak semua listing harus bagus.

Market harus mempunyai:

```text
Good Deal
Fair Deal
Bad Deal
Hidden Gem
```

Pemain belajar mengenali value.

---

# 185. “HIDDEN GEM” SYSTEM

Rongsokan sesekali mempunyai:

```text
low price
higher potential
```

Contoh:

```text
Project:
Rp 2.5M

Condition:
20%

But:
Rare Frame
```

Pemain yang memahami market dapat melihat peluang.

Ini menciptakan skill ekonomi tanpa sistem rumit.

---

# 186. CUSTOMER VS SELF BUILD

Player harus selalu punya pilihan:

```text
Build for Customer
```

atau:

```text
Build for Self
```

Customer:

```text
Guaranteed Income
```

Self:

```text
Potential Profit
Potential Race Success
```

Ini menciptakan opportunity cost.

---

# 187. RACE VS BUSINESS

Race:

```text
Potentially high reward
Condition wear
Entry fee
```

Business:

```text
Predictable reward
Uses time/capacity
```

Pemain menentukan risk profile.

---

# 188. JOKI VS MOTOR

Motor bagus dengan joki biasa:

```text
Strong
```

Joki bagus dengan motor buruk:

```text
Limited
```

Motor bagus + joki bagus:

```text
Expensive
```

Sehingga budget management tetap penting.

---

# 189. SPONSOR VS FREEDOM

Sponsor memberikan:

```text
Money
```

tetapi:

```text
Objective
```

Pemain dapat memilih:

```text
Take Sponsor
Skip Sponsor
```

Jangan paksa semua orang menerima sponsor.

---

# 190. GAME SHOULD CREATE STORIES WITHOUT A STORY MODE

Cerita muncul dari:

```text
Rongsokan murah
↓
Build berhasil
↓
Race menang
↓
Value naik
↓
Sponsor datang
↓
Customer datang
↓
Motor dijual
```

Itu sudah menjadi cerita pemain.

---

# 191. EXAMPLE PLAYER STORY

Musim pertama:

```text
Garage:
Level 1

Motor:
Nusa Sprint

Cash:
Rp 5M
```

Pemain menemukan rongsokan:

```text
Garuda RX
Rp 2M
```

Dia membeli.

Build:

```text
Rp 5M
```

Total:

```text
Rp 7M
```

Race pertama:

```text
3rd
```

Race kedua:

```text
1st
```

Value meningkat:

```text
Rp 10M
```

Pemain menjual.

Profit:

```text
Rp 3M
```

Kemudian menggunakan profit untuk:

```text
Hire Joki
Upgrade Garage
```

Musim kedua:

```text
Official Street
```

Cerita berkembang secara alami.

---

# 192. SOCIAL LAYER UNTUK MASA DEPAN

Kalau game sudah sukses, barulah tambahkan:

```text
Player marketplace
Player garages
Asynchronous challenge
Garage showcase
Time attack leaderboard
```

Semuanya masih memakai object model yang sama.

Tidak perlu membuat game baru.

---

# 193. MULTIPLAYER MASA DEPAN

Versi paling aman:

```text
ASYNC RACING
```

Player A:

```text
8.311 sec
```

Player B mencoba mengalahkan.

Kemudian:

```text
Garage Leaderboard
Class Leaderboard
Season Leaderboard
```

Tidak perlu real-time.

---

# 194. OPTIONAL PLAYER-TO-PLAYER MARKET

Jika nanti dibutuhkan:

```text
Player lists motor
Other player buys
```

Server menggunakan:

```text listing
transaction
ownership transfer
```

Architecture awal tetap kompatibel.

---

# 195. ROADMAP BESAR

## V0.1

Garage + Motor + Parts.

## V0.2

Race Minigame.

## V0.3

Market + Rongsokan.

## V0.4

Customer Orders.

## V0.5

Joki.

## V0.6

Sponsor.

## V0.7

Official Championship.

## V0.8

Garage Progression.

## V0.9

Leaderboard.

## V1.0

Full Core Game.

---

# 196. V1.0 FEATURE SET

Pada saat disebut “1.0”, game harus memiliki:

```text
Garage Management
Motor Ownership
Stock Motors
Used Motors
Salvage Projects
Parts
Build System
Repair
Customer Orders
Motor Sales
Motor Trading
Joki Contracts
Liar Racing
Official Racing
Classes
Championship
Sponsors
Garage Progression
Reputation
Motor History
Joki History
Async Leaderboard
```

Itu sudah merupakan game yang utuh.

---

# 197. TIDAK ADA NEED UNTUK

BENGKEL MALAM tidak membutuhkan:

```text
Energy
Nerve
Mana
Stamina bar universal
Player XP
Skill tree raksasa
Faction
Territory
NPC simulation
Open world
Crime engine
Police engine
Complex crafting
Complex diplomacy
Multiple social currencies
```

Semua itu merupakan distraksi dari fantasy utama.

---

# 198. THE ONE-SCREEN TEST

Jika semua fitur utama belum bisa dijelaskan melalui:

```text
GARAGE
MOTOR
MARKET
CUSTOMER
TEAM
RACE
```

berarti sistem mulai terlalu rumit.

---

# 199. THE FIVE-MINUTE TEST

Dalam lima menit pertama pemain harus dapat:

```text
Membeli motor
Melihat kondisi
Membeli part
Melakukan build
Memilih race
Memainkan minigame
Mendapat uang
```

---

# 200. THE THIRTY-MINUTE TEST

Dalam tiga puluh menit pemain harus mengalami:

```text
Motor upgrade
First sale
First customer
First race
First joki decision
First meaningful money decision
```

---

# 201. THE ONE-HOUR TEST

Dalam satu jam:

```text
Garage mulai berkembang
Motor mulai berbeda
Joki mulai mempunyai identitas
Customer mulai penting
Official race mulai terbuka
```

---

# 202. THE LONG-TERM TEST

Setelah banyak sesi:

```text
Saya punya sejarah.
Saya punya motor favorit.
Saya punya joki favorit.
Saya punya cara menghasilkan uang.
Saya punya garage identity.
Saya mempunyai target championship berikutnya.
```

Kalau lima hal tersebut muncul, game sudah berhasil.

---

# 203. THE MOST IMPORTANT SYSTEM RELATIONSHIP

```text
MOTOR
  ↓
BUILD
  ↓
RACE
  ↓
REPUTATION
  ↓
CUSTOMER
  ↓
MONEY
  ↓
PROJECT
  ↓
MOTOR
```

Ini adalah loop emas.

---

# 204. SECONDARY LOOP

```text
MARKET
↓
BUY LOW
↓
REPAIR
↓
BUILD
↓
SELL HIGH
↓
PROFIT
```

---

# 205. THIRD LOOP

```text
JOKI
↓
RACE
↓
WIN
↓
REPUTATION
↓
SPONSOR
↓
MORE MONEY
↓
BETTER JOKI
```

Ketiganya berputar melalui **Bengkel**.

---

# 206. FINAL GAME IDENTITY

BENGKEL MALAM bukan:

> racing game dengan menu garage.

Bukan juga:

> tycoon game yang kebetulan punya racing minigame.

BENGKEL MALAM adalah:

> **garage business game di mana racing menjadi pembuktian dari kualitas bengkel.**

---

# 207. FINAL PLAYER FANTASY

Pemain harus dapat berkata:

> “Motor ini saya temukan di rongsokan.”

> “Saya sendiri yang bangun.”

> “Bayu yang bawa.”

> “Kami menang di Street.”

> “Setelah itu ada customer yang tertarik.”

> “Saya jual motor tersebut.”

> “Profit-nya saya pakai buat buka bengkel kedua.”

Itulah pengalaman yang harus kita kejar.

---

# 208. FINAL DESIGN SENTENCE

> **Bangun bengkel. Temukan motor. Racik sampai punya karakter. Pilih orang yang membawanya. Bawa ke lintasan. Menang atau kalah, keputusan itu kembali menjadi bagian dari bisnis.**

---

# 209. THE 12 IMMUTABLE RULES

```text
01. Bengkel adalah pusat game.

02. Motor adalah aset paling penting.

03. Motor dapat dibeli stock, used, atau project rongsokan.

04. Motor dapat dibangun, dipakai balap, atau dijual.

05. Income tidak bergantung pada balapan.

06. Customer order adalah sumber income utama tambahan.

07. Joki dapat direkrut dan dikelola.

08. Balap memiliki dua jalur: LIAR dan RESMI.

09. RESMI memiliki kelas dan championship.

10. LIAR adalah event-based, cepat, dan berisiko lebih tinggi.

11. Minigame menentukan eksekusi pemain.

12. Semua sistem harus berputar kembali ke bengkel, motor, uang, atau reputasi.
```

---

# 210. FINAL GAME LOOP

```text
                     ┌─────────────┐
                     │   BENGKEL   │
                     └──────┬──────┘
                            │
              ┌─────────────┼──────────────┐
              ↓             ↓              ↓
           MARKET         ORDER          TEAM
              │             │              │
              ↓             ↓              ↓
           MOTOR         CUSTOMER         JOKI
              │             │              │
              └──────┬──────┴──────┬───────┘
                     ↓             ↓
                   BUILD         RACE
                     │        ┌────┴────┐
                     │        ↓         ↓
                     │      LIAR      RESMI
                     │                  │
                     └────────┬─────────┘
                              ↓
                        RESULT / SALE
                              ↓
                           MONEY
                              ↓
                         REPUTATION
                              ↓
                       GARAGE GROWTH
                              ↓
                         BETTER MOTOR
                              ↓
                           BENGKEL
```

---

# 211. DEFINISI FINAL BENGKEL MALAM

> **BENGKEL MALAM adalah game management otomotif berlatar kultur Indonesia fiktif, di mana pemain membangun bengkel dari garasi kecil menjadi tim dan bisnis otomotif yang dikenal melalui empat kegiatan inti: memperbaiki dan membangun motor, membeli dan menjual motor, melayani customer, serta mengelola joki untuk mengikuti balap liaran dan kompetisi resmi berbasis kelas.**
>
> **Kedalaman game tidak berasal dari jumlah sistem yang besar, tetapi dari keterhubungan sederhana antara motor, part, uang, customer, joki, race, dan reputasi.**

---

# 212. VISI AKHIR

Pemain membuka game.

Bukan untuk bertanya:

> “Quest saya apa?”

Tetapi:

> **“Bengkel saya mau dibawa ke mana hari ini?”**

Mungkin jawabannya:

```text
Cari RX project.
```

Besok:

```text
Selesaikan customer build.
```

Malam:

```text
Turun di balap liar.
```

Akhir pekan:

```text
Official Street Championship.
```

Bulan berikutnya:

```text
Jual motor lama.
Kontrak joki baru.
Naikkan level bengkel.
```

Dan beberapa musim kemudian:

```text
BENGKEL MALAM

Founded:
Season 1

Championships:
4

Motors Built:
73

Motors Sold:
91

Customer Builds:
312

Race Wins:
57

Famous Joki:
Bayu

Most Valuable Build:
Rp 42M

Garage Rank:
LEGENDARY
```

Pemain akhirnya tidak merasa telah:

> **“menamatkan game.”**

Pemain merasa:

> **“Saya membangun bengkel ini.”**

---

# 213. PATOKAN UTAMA UNTUK DEVELOPMENT

Mulai saat ini, semua desain fitur BENGKEL MALAM sebaiknya melewati pertanyaan berikut:

```text
Apakah ini membuat motor lebih menarik?

Apakah ini membuat keputusan bengkel lebih menarik?

Apakah ini membuat money management lebih menarik?

Apakah ini membuat joki lebih berarti?

Apakah ini membuat race lebih menarik?

Apakah ini menciptakan trade-off?

Apakah ini dapat dibuat tanpa membuka sistem besar baru?
```

Dan aturan terpenting:

> **Jangan menambah sistem ketika sebenarnya kita bisa membuat sistem yang sudah ada menjadi lebih dalam.**

BENGKEL MALAM harus tetap kecil secara arsitektur tetapi besar secara kemungkinan keputusan.

**Garage → Motor → Build → Customer / Race → Money → Growth → Garage** adalah fondasi permanennya.
