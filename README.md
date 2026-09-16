# BENGKEL MALAM

## *Racik. Jual. Balap.*

**Genre:** Garage Management / Vehicle Trading / Restoration / Drag Racing
**Format:** Web-based game
**Technology target:** Astro
**Visual:** Full pixel-art UI dan game presentation melalui coded UI, SVG, CSS pixel-art, dan sprite asset terkontrol
**Mode utama:** Single-player persistent career dengan AI rivals
**Multiplayer masa depan:** Async leaderboard / challenge, bukan realtime sebagai fondasi awal
**Setting:** Dunia otomotif Indonesia fiktif
**Core fantasy:** Membangun bengkel kecil menjadi garasi terkenal melalui service, restorasi, jual-beli motor, build, customer work, joki, balap liaran, dan kompetisi resmi.

---

# 0. VISI ABSOLUT

BENGKEL MALAM bukan game tentang menjadi pembalap tercepat.

BENGKEL MALAM juga bukan game simulator mekanik realistis.

BENGKEL MALAM adalah game tentang:

> **membangun sebuah bengkel, membangun motor, dan membangun nama.**

Pemain harus merasa bahwa:

```text
Motor yang saya beli
        ↓
Motor yang saya perbaiki
        ↓
Motor yang saya bangun
        ↓
Motor yang saya balapkan
        ↓
Motor yang saya jual
```

adalah bagian dari keputusan bisnis yang sama.

---

# 1. FINAL PLAYER FANTASY

Pemain memulai sebagai orang biasa dengan bengkel kecil.

Tidak punya:

```text
team besar
uang besar
motor bagus
joki terkenal
sponsor besar
```

Yang dimiliki hanya:

```text
garasi
beberapa tools
satu motor
sedikit uang
```

Lalu pemain mulai membangun:

```text
bengkel
↓
motor
↓
customer
↓
joki
↓
reputasi
↓
race results
↓
profit
↓
garage
```

Target akhir bukan “finish game”.

Target akhirnya adalah:

> **memiliki bengkel yang punya identitas.**

---

# 2. CORE SENTENCE

Seluruh game harus selalu dapat dikembalikan ke kalimat ini:

> **Beli motor murah. Hidupkan. Racik. Tentukan tujuannya. Jual atau bawa ke lintasan. Gunakan hasilnya untuk membangun bengkel yang lebih besar.**

Kalau suatu fitur tidak membantu kalimat tersebut, fitur harus dipertanyakan kembali.

---

# 3. GAME LOOP UTAMA

```text
DISCOVER
   ↓
BUY
   ↓
INSPECT
   ↓
REPAIR
   ↓
BUILD
   ↓
TEST
   ↓
USE / RACE / SELL
   ↓
EARN
   ↓
REINVEST
   ↓
GROW GARAGE
   ↓
BETTER OPPORTUNITIES
   ↓
DISCOVER
```

---

# 4. EMPAT PILAR GAME

Semua sistem hanya berada di salah satu dari empat domain besar:

```text
BENGKEL
MOTOR
BISNIS
BALAP
```

Joki dan customer bukan sistem dunia yang berdiri sendiri.

Mereka adalah bagian dari:

```text
BISNIS
+
BALAP
```

---

# 5. BENGKEL

Bengkel adalah:

* home
* inventory hub
* workshop
* business center
* team center
* identity

Semua aktivitas utama kembali ke bengkel.

---

# 6. MOTOR

Motor adalah objek paling penting.

Motor dapat:

```text
dibeli
diperiksa
diperbaiki
dibongkar
dirakit
dimodifikasi
dituning
dipakai race
dijual
dikoleksi
```

Satu motor dapat menjadi pusat puluhan keputusan tanpa membutuhkan puluhan sistem.

---

# 7. BISNIS

Bengkel menghasilkan uang melalui:

```text
Service
Repair
Customer Build
Motor Sale
Project Flip
Race
Sponsor
```

Tidak boleh ada ketergantungan pada satu income source.

---

# 8. BALAP

Balap adalah payoff.

Setelah:

```text
pilih motor
+
build
+
joki
+
setup
```

pemain mendapatkan kesempatan untuk benar-benar memainkan hasil keputusannya melalui minigame.

---

# 9. DUA MODE BALAP

Game mempunyai dua mode utama:

# LIAR

dan

# RESMI

---

# 10. LIAR

Mode liar adalah event race fiktif yang bersifat:

```text
cepat
spontan
high-stakes
flexible
```

Secara gameplay tidak perlu mensimulasikan polisi, kejar-kejaran, ataupun detail pelanggaran dunia nyata.

Fokusnya adalah:

```text
event
stake
motor
joki
timing
result
reward
```

Contoh:

```text
NIGHT SPRINT
Stake: Rp 500K
Prize: Rp 2.5M
```

---

# 11. KARAKTER MODE LIAR

Liar:

```text
No long season
Flexible class
Quick matches
Higher variance
Short session
```

Digunakan sebagai:

> **quick money + quick test + quick action.**

---

# 12. RESMI

Mode resmi merupakan competitive progression.

Struktur:

```text
CLASS
↓
RACE
↓
POINTS
↓
CHAMPIONSHIP
↓
SEASON RESULT
```

Mode resmi menjadi:

> **long-term goal.**

---

# 13. OFFICIAL CLASS

Awal:

```text
STREET
PRO
OPEN
```

Jangan menambah sepuluh kelas sebelum tiga kelas tersebut terasa berbeda.

---

# 14. CLASS SYSTEM

Motor mempunyai:

```text
Build Score
```

Kelas dibaca dari Build Score.

Contoh baseline:

```text
STREET
0–69

PRO
70–89

OPEN
90+
```

Angka tersebut merupakan balancing parameter, bukan hukum permanen.

---

# 15. CLASS TRADE-OFF

Pemain mungkin mempunyai motor:

```text
Build Score 69
```

Motor masih dapat ikut:

```text
STREET
```

Jika pemain menaikkan score menjadi:

```text
72
```

motor sekarang masuk:

```text
PRO
```

Pemain harus bertanya:

> “Apakah upgrade ini benar-benar menguntungkan?”

Ini menciptakan keputusan sederhana tetapi dalam.

---

# 16. GARAGE ASSET

Garage mempunyai:

```text
Level
Motor Capacity
Order Capacity
Mechanic Capacity
Driver Capacity
```

Tidak perlu building-management simulator kompleks.

---

# 17. GARAGE LEVEL

## Level 1 — Garasi Kecil

```text
2 Motor
1 Mechanic
1 Joki
1 Order
```

## Level 2 — Bengkel

```text
4 Motor
2 Mechanic
2 Joki
2 Order
```

## Level 3 — Performance Shop

```text
6 Motor
3 Mechanic
3 Joki
3 Order
```

## Level 4 — Racing Workshop

```text
8 Motor
4 Mechanic
4 Joki
4 Order
```

## Level 5 — Elite Garage

```text
10 Motor
5 Mechanic
6 Joki
6 Order
```

---

# 18. GARAGE UPGRADES

Upgrade utama:

```text
Workspace
Tools
Motor Storage
Order Capacity
Staff Capacity
Display
```

Semua ada dalam satu sistem upgrade.

---

# 19. NO WAITING

Upgrade:

> dibeli → langsung aktif.

Repair:

> dilakukan → langsung selesai.

Build:

> dilakukan → langsung selesai.

Customer:

> dikerjakan → langsung selesai.

Tidak ada:

```text
Wait 4 hours
Wait 8 hours
Energy refill
Repair timer
```

---

# 20. GAME LIMITERS

Karena tidak ada energy dan cooldown, game menggunakan limiter alami:

```text
Money
Capacity
Condition
Class
Choices
```

Inilah yang membatasi progression.

---

# 21. MOTOR MODEL

Motor memiliki base identity.

Contoh fiktif:

```text
NUSA 125
JATRA 135
GARUDA 150
MERAPI 155
ARUNA 180
```

Semua model fiktif agar game tidak tergantung lisensi.

---

# 22. MOTOR BASE STATS

Cukup empat:

```text
POWER
ACCELERATION
GRIP
RELIABILITY
```

Tidak perlu dua puluh statistik.

---

# 23. MOTOR BASE IDENTITY

Contoh:

### NUSA 125

```text
Cheap
Balanced
Reliable
```

### JATRA 135

```text
Acceleration
Lightweight
Good Street Base
```

### GARUDA 150

```text
Power
High Upgrade Potential
Lower Base Reliability
```

---

# 24. MOTOR CONDITION

Kondisi motor:

```text
Excellent
Good
Worn
Poor
Broken
```

Gunakan status diskrit sebagai tampilan utama.

Angka internal tetap boleh ada jika diperlukan balancing.

---

# 25. MOTOR SOURCES

Motor dapat diperoleh dari:

```text
STOCK
USED
SALVAGE
CUSTOM
```

---

# 26. STOCK MOTOR

Siap dipakai.

Kelebihan:

```text
good condition
easy start
low risk
```

Kekurangan:

```text
harga mahal
stock performance
```

---

# 27. USED MOTOR

Bekas.

Kelebihan:

```text
harga murah
potensi bagus
```

Kekurangan:

```text
condition
part wear
repair cost
```

---

# 28. SALVAGE MOTOR

Motor project/rongsokan.

Kelebihan:

```text
sangat murah
potensi margin besar
```

Kekurangan:

```text
banyak part missing
condition buruk
butuh modal
```

---

# 29. CUSTOM MOTOR

Motor yang telah menjadi hasil build pemain.

Dapat:

```text
dipakai
dijual
dipajang
dirace
```

---

# 30. RONGSOKAN

Rongsokan adalah salah satu signature feature BENGKEL MALAM.

Menu:

# RONGSOKAN

Setiap refresh menghasilkan beberapa project.

Contoh:

```text
GARUDA 150 PROJECT

Frame:
GOOD

Engine:
BROKEN

ECU:
MISSING

Clutch:
WORN

Body:
POOR

Price:
Rp 3.200.000
```

---

# 31. PROJECT HUNTING

Tujuan rongsokan bukan sekadar membeli murah.

Pemain mencari:

```text
hidden value
rare frame
cheap base
valuable part
```

Pemain yang memahami motor akan lebih baik dalam menemukan peluang.

---

# 32. MOTOR INSPECTION

Sebelum membeli project, pemain dapat melihat:

```text
Frame
Engine
Electrical
Transmission
Body
```

Semua terlihat.

Tidak ada “mystery loot” yang sengaja menyembunyikan informasi secara curang.

---

# 33. MOTOR COMPONENT SYSTEM

Komponen inti:

```text
ENGINE
ENGINE HEAD
ECU
CARB / INJECTION
TRANSMISSION
CLUTCH
EXHAUST
FRONT TIRE
REAR TIRE
BRAKE
SUSPENSION
BODY
```

12 komponen.

---

# 34. COMPONENT QUALITY

Setiap komponen memiliki quality:

```text
STOCK
AFTERMARKET
PERFORMANCE
SPECIAL
```

---

# 35. COMPONENT CONDITION

Setiap komponen:

```text
GOOD
WORN
BROKEN
```

Contoh:

```text
Engine — WORN
ECU — PERFORMANCE
Clutch — BROKEN
Tire — STOCK
```

---

# 36. COMPONENT ACTIONS

Pemain dapat:

```text
Inspect
Repair
Replace
Install
Remove
Sell
```

---

# 37. REPAIR

Part yang WORN:

```text
Repair
```

Part yang BROKEN:

```text
Replace
```

atau jika game content mengizinkan:

```text
Restore
```

---

# 38. REPAIR ECONOMY

Repair lebih murah.

Replacement lebih mahal.

Dengan begitu:

```text
Repair
vs
Replace
```

menjadi keputusan.

---

# 39. PART MARKET

Part dapat dibeli langsung.

Kategori:

```text
Engine
ECU
Transmission
Clutch
Exhaust
Tire
Suspension
Body
```

---

# 40. PART VALUE

Part mempunyai:

```text
Buy Price
Quality
Condition
Performance
Resale Value
```

---

# 41. BUILD SYSTEM

Build = kombinasi komponen motor.

Contoh:

```text
Engine Performance
+
Street ECU
+
Sport Clutch
+
Drag Tire
+
Performance Exhaust
```

---

# 42. BUILD PURPOSE

Pemain tidak sekadar mengejar “angka terbesar”.

Build mempunyai tujuan:

```text
STREET
DRAG
BALANCED
POWER
RELIABLE
```

Label ini hanya membantu.

Tidak mengunci pemain.

---

# 43. TUNING

Tuning sangat sederhana.

Preset:

```text
BALANCED
ACCELERATION
TOP SPEED
RELIABILITY
```

Contoh:

```text
ACCELERATION

Acceleration ↑
Reliability ↓
```

---

# 44. BUILD SCORE

Build Score adalah ringkasan.

Contoh:

```text
Build Score: 73
```

Digunakan untuk:

```text
Class
Customer requirement
Market perception
Race eligibility
```

---

# 45. BUILD QUALITY

Hasil build:

```text
STANDARD
GOOD
EXCELLENT
MASTER
```

Dipengaruhi oleh:

```text
Parts
Mechanic
Garage Level
```

---

# 46. MECHANIC

Mechanic adalah staff.

Data:

```text
Name
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

# 47. MECHANIC BENEFITS

Skill tinggi memberikan:

```text
Build Quality
Repair Efficiency
Consistency
```

Jangan membuat mechanic AI berjalan-jalan atau mempunyai schedule kompleks.

---

# 48. CUSTOMER SYSTEM

Customer memberikan business loop kedua.

Customer datang dengan:

```text
Motor
Request
Budget
Reward
Requirement
```

---

# 49. CUSTOMER JOB TYPES

Hanya lima:

```text
SERVICE
REPAIR
RESTORATION
STREET BUILD
RACE BUILD
```

---

# 50. CUSTOMER SERVICE

Contoh:

```text
Basic Service
Rp 300K
```

Pemain memilih:

```text
ACCEPT
```

kemudian langsung selesai.

Tidak perlu simulation.

---

# 51. CUSTOMER REPAIR

Customer membawa motor:

```text
Clutch Broken
Condition Poor
```

Pemain:

```text
Repair
```

Dapat payment.

---

# 52. CUSTOMER RESTORATION

Customer membawa project.

Pemain memperbaiki beberapa komponen.

Reward lebih tinggi.

---

# 53. CUSTOMER BUILD

Customer meminta target:

```text
Build Score ≥ 70
Budget ≤ Rp 6M
```

Pemain merancang build.

---

# 54. CUSTOMER RACE BUILD

Customer:

> “Saya ingin motor ini siap untuk Pro.”

Pemain harus mengatur:

```text
Class
Build
Cost
Reliability
```

---

# 55. CUSTOMER DECISION

Setiap order:

```text
Accept
Reject
```

Jika accept:

```text
Choose Build Strategy
```

---

# 56. CUSTOMER MARGIN

Contoh:

```text
Customer Budget
Rp 6M

Parts Cost
Rp 3.5M

Profit
Rp 2.5M
```

Build lebih mahal:

```text
Parts Cost
Rp 5.5M

Profit
Rp 500K
```

Jadi pemain harus menjaga margin.

---

# 57. CUSTOMER SATISFACTION

Satu angka:

```text
0–100
```

Dipengaruhi:

```text
Target
Quality
Budget
```

---

# 58. CUSTOMER REPUTATION

Satisfaction memengaruhi:

```text
Garage Reputation
```

Reputation membuka:

```text
better orders
better motors
better sponsors
```

---

# 59. MOTOR TRADING

Pemain bisa mencari profit dari:

```text
BUY
→
REPAIR
→
BUILD
→
SELL
```

---

# 60. MOTOR SALE SCREEN

Harus menampilkan:

```text
Purchase Cost
Repair Cost
Parts Cost
Total Investment
Estimated Value
Potential Profit
```

Ini adalah salah satu layar paling penting.

---

# 61. TRADING STRATEGY

Ada tiga pola:

```text
QUICK FLIP
```

repair sedikit → jual.

```text
BUILD FLIP
```

repair + build → jual.

```text
RACE FLIP
```

build + race → jual.

---

# 62. QUICK FLIP

Risiko rendah.

Margin kecil.

---

# 63. BUILD FLIP

Risiko sedang.

Margin lebih besar.

---

# 64. RACE FLIP

Potensi margin paling tinggi.

Tetapi:

```text
Race wear
Entry Fee
Potential Loss
```

meningkat.

---

# 65. MARKET

Market terdiri dari:

```text
MOTOR
PART
RONGSOKAN
MY SALES
```

---

# 66. MARKET ROTATION

Market di-refresh saat session tertentu atau pergantian hari, tetapi refresh bukan cooldown gameplay.

Pemain tetap bisa bermain.

Saat market berubah:

> **opsi berubah, bukan gameplay diblokir.**

---

# 67. MARKET EVENTS

Event ringan:

```text
POPULAR MODEL
PROJECT WEEK
RACING SEASON
PART SHORTAGE
```

Hanya memodifikasi market.

---

# 68. REPUTATION

Gunakan satu reputasi:

# GARAGE REPUTATION

Tidak perlu:

```text
Fame
Fear
Respect
Infamy
Trust
```

terpisah.

---

# 69. REPUTATION SOURCES

Reputation naik dari:

```text
Race Result
Customer Satisfaction
Successful Builds
Motor Sales
Championship
```

---

# 70. REPUTATION TIERS

```text
UNKNOWN
LOCAL
KNOWN
ESTABLISHED
RESPECTED
RENOWNED
LEGENDARY
```

---

# 71. REPUTATION PURPOSE

Reputation membuka:

```text
Customers
Sponsors
Drivers
Races
Parts
Market Opportunities
```

Bukan damage bonus.

---

# 72. JOKI

Joki adalah salah satu aset manajemen.

Pemain dapat:

```text
SCOUT
SIGN
ASSIGN
RELEASE
```

---

# 73. JOKI STATS

Tiga stat:

```text
REACTION
SHIFT
CONSISTENCY
```

---

# 74. JOKI TRAITS

Lima trait:

```text
AGGRESSIVE
TECHNICAL
CONSISTENT
COMEBACK
ROOKIE
```

---

# 75. JOKI COST

Joki memiliki:

```text
Signing Fee
Race Fee
```

Tidak ada salary simulation rumit pada versi awal.

---

# 76. JOKI PROGRESSION

Joki berkembang dari:

```text
Race Count
Wins
Experience
```

Milestone meningkatkan stat sedikit.

---

# 77. JOKI REPUTATION

Joki juga punya:

```text
Driver Reputation
```

Driver terkenal dapat:

```text
signing cost ↑
race fee ↑
team value ↑
```

Tetapi lebih bagus dalam menarik perhatian.

---

# 78. JOKI ASSIGNMENT

Sebelum race:

```text
Choose Driver
Choose Motor
```

Keduanya menjadi keputusan.

---

# 79. DRIVER DIFFERENTIATION

Contoh:

### RAKA

```text
Reaction 86
Shift 73
Consistency 66
Aggressive
```

### DITO

```text
Reaction 75
Shift 82
Consistency 91
Consistent
```

Race pendek:

> Raka mungkin lebih cocok.

Race technical:

> Dito mungkin lebih cocok.

---

# 80. RACE TRACK

Track tidak perlu dibuat sebagai level 3D.

Track hanya memiliki profile:

```text
SHORT
MEDIUM
LONG
TECHNICAL
```

---

# 81. TRACK EFFECT

### SHORT

```text
Acceleration important
```

### MEDIUM

```text
Balanced
```

### LONG

```text
Power important
```

### TECHNICAL

```text
Grip + Shift important
```

---

# 82. TRACK CONDITION

Tiga:

```text
DRY
WET
NIGHT
```

---

# 83. DRY

Normal.

---

# 84. WET

Grip menjadi lebih penting.

---

# 85. NIGHT

Timing sedikit lebih menuntut.

Semua efek tetap kecil agar motor tidak terasa random.

---

# 86. RACE PREPARATION

Sebelum race pemain menentukan:

```text
Motor
Driver
Risk Mode
```

---

# 87. RISK MODE

Tiga pilihan:

```text
SAFE
NORMAL
PUSH
```

---

# 88. SAFE

```text
Easier minigame
Lower max performance
Lower wear
```

---

# 89. NORMAL

```text
Default
```

---

# 90. PUSH

```text
Harder minigame
Higher potential
Higher wear
```

---

# 91. RACE MINIGAME

Inti gameplay:

```text
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

---

# 92. LAUNCH

Countdown:

```text
3
2
1
GO
```

Pemain tap pada timing.

Result:

```text
PERFECT
GOOD
LATE
MISS
```

---

# 93. SHIFT

RPM indicator:

```text
LOW —— OPTIMAL —— REDLINE
```

Pemain tap Shift.

Result:

```text
PERFECT
GOOD
LATE
OVERREV
```

---

# 94. RACE DURATION

Target:

```text
8–15 seconds
```

Race harus cukup singkat untuk dimainkan berulang kali.

---

# 95. PLAYER SKILL

Race result berasal dari:

```text
Motor
+
Joki
+
Track
+
Risk
+
Player Timing
+
Small Randomness
```

---

# 96. PLAYER TIMING

Ini yang membuat racing tetap game.

Motor bagus tidak menjamin otomatis menang.

---

# 97. MOTOR PERFORMANCE

Motor memberi baseline.

```text
Power
Acceleration
Grip
Reliability
```

---

# 98. DRIVER PERFORMANCE

Driver memperlebar atau mempersempit window.

---

# 99. SMALL RANDOMNESS

Sedikit random membuat hasil tidak sepenuhnya deterministic.

Tetapi random tidak boleh mengalahkan:

```text
good build
good joki
good execution
```

---

# 100. RACE RESULT

Hasil:

```text
1ST
2ND
3RD
...
DNF
```

Reward:

```text
Money
Reputation
Points
Driver Experience
Motor History
```

---

# 101. MOTOR WEAR

Setelah race:

```text
Condition ↓
```

Bukan stamina pemain.

Ini membuat repair tetap relevan.

---

# 102. BREAKDOWN

Breakdown hanya mungkin ketika:

```text
Low Reliability
+
High Push
```

Efek:

```text
Performance Penalty
atau
DNF
```

Jarang terjadi.

---

# 103. OFFICIAL SEASON

Season:

```text
8 Races
```

---

# 104. CHAMPIONSHIP POINTS

Contoh:

```text
1st — 25
2nd — 18
3rd — 15
4th — 12
5th — 10
```

---

# 105. SEASON RESULT

Di akhir season:

```text
Champion
Top 3
Mid Table
```

Reward:

```text
Money
Reputation
Sponsor Unlock
```

---

# 106. SEASON PERSISTENCE

Yang tetap:

```text
Garage
Motors
Money
Joki
Reputation
History
```

Yang reset:

```text
Championship Points
Season Position
```

---

# 107. RIVAL

Rival adalah AI data sederhana.

Contoh:

```text
JAYA SPEED
Base Performance: High
Preferred: Short
Consistency: Medium
```

---

# 108. RIVAL BEHAVIOR

Tidak perlu AI strategy.

Hanya:

```text
Base Speed
Variance
Track Preference
Class
```

---

# 109. RIVAL STORY

Rival menjadi memorable melalui result.

Contoh:

```text
Race 2:
You beat Jaya Speed.

Race 5:
Jaya Speed beat you.

Race 7:
You beat them again.
```

Itu sudah cukup menciptakan rivalry.

---

# 110. SPONSOR

Sponsor adalah bonus business progression.

Jenis:

```text
PART
OIL
GARAGE
RACING
LOCAL BUSINESS
```

Semua sponsor fiktif.

---

# 111. SPONSOR CONTRACT

Contoh:

```text
Sponsor:
Nusa Performance

Target:
Top 3 × 3

Reward:
Rp 8M
```

Atau:

```text
Target:
Complete 5 customer builds

Reward:
Part Discount
```

---

# 112. SPONSOR CHOICE

Pemain bebas:

```text
ACCEPT
REJECT
```

Sponsor bukan wajib.

---

# 113. SPONSOR DIFFICULTY

```text
Easy
Medium
Hard
```

Semakin sulit:

```text
Reward ↑
```

---

# 114. CUSTOMER + SPONSOR

Ini membuat business loop lebih dalam.

Sponsor bisa meminta:

```text
Complete Builds
Win Race
Sell Motor
```

Jadi sponsor tidak hanya berkaitan dengan racing.

---

# 115. GARAGE SPECIALIZATION

Level 3+ pemain dapat memilih bonus kecil:

```text
PERFORMANCE
TRADING
SERVICE
RACING
```

---

# 116. PERFORMANCE

```text
Build cost ↓ sedikit
```

---

# 117. TRADING

```text
Resale value ↑ sedikit
```

---

# 118. SERVICE

```text
Customer satisfaction ↑ sedikit
```

---

# 119. RACING

```text
Race repair cost ↓ sedikit
```

---

# 120. SPECIALIZATION RULE

Specialization tidak membuat class.

Pemain tetap dapat melakukan semuanya.

---

# 121. GARAGE VISUAL PROGRESSION

Level garage harus terlihat.

### Level 1

```text
1 Motor
Workbench
Toolbox
Simple Wall
```

### Level 3

```text
Lift
Part Rack
More Bikes
Tuning Area
```

### Level 5

```text
Showroom
Trophy Wall
Sponsor Signage
Multiple Stands
```

---

# 122. PIXEL PRESENTATION

Semua visual game:

```text
pixel-inspired
hard edges
limited palette
strong silhouettes
small sprites
```

---

# 123. PIXEL UI PHILOSOPHY

Gunakan:

```text
4px
8px
12px
16px
24px
32px
```

sebagai spacing basis.

---

# 124. CORNER STYLE

Jangan menggunakan modern rounded cards berlebihan.

Gunakan:

```text
0–4px radius
pixel corners
hard borders
```

---

# 125. SHADOW

Gunakan hard pixel offset.

Misalnya:

```text
4px 4px 0
```

Tidak perlu soft shadow besar.

---

# 126. TYPOGRAPHY

Dua fungsi:

```text
Pixel / Arcade
→ headings / title / race
```

```text
Monospace
→ data / stats / money
```

Readability tetap prioritas.

---

# 127. COLOR LANGUAGE

Palet dunia:

```text
Asphalt
Metal
Cream
Rust
Red
Orange
Yellow
Deep Green
```

Nuansa:

> bengkel malam + lampu jalan + besi + oli.

---

# 128. UI COMPONENT PRINCIPLES

Komponen harus reusable.

Contoh:

```text
PixelPanel
PixelButton
PixelBadge
PixelWindow
PixelCard
PixelStat
PixelBar
PixelModal
PixelToast
PixelSprite
```

---

# 129. MAIN NAVIGATION

Mobile:

```text
GARAGE
MOTOR
WORKSHOP
MARKET
TEAM
RACE
```

Desktop bisa menggunakan sidebar.

---

# 130. GARAGE PAGE

Garage page menjawab:

> “Apa keadaan bisnis saya sekarang?”

Menampilkan:

```text
Cash
Reputation
Garage Level
Active Orders
Motor Status
Next Race
```

---

# 131. MOTOR PAGE

Menjawab:

> “Apa yang saya punya?”

Menampilkan:

```text
Motor List
Condition
Build Score
Value
```

---

# 132. MOTOR DETAIL

Tabs:

```text
OVERVIEW
PARTS
BUILD
HISTORY
VALUE
```

---

# 133. WORKSHOP PAGE

Menjawab:

> “Apa yang sedang saya kerjakan?”

Menampilkan:

```text
Customer Jobs
Repair
Build
Mechanics
```

---

# 134. MARKET PAGE

Menjawab:

> “Apa peluang saya?”

Menampilkan:

```text
Motor
Parts
Rongsokan
My Sales
```

---

# 135. TEAM PAGE

Menjawab:

> “Siapa yang membantu saya?”

Menampilkan:

```text
Joki
Contract
Stats
History
```

---

# 136. RACE PAGE

Menjawab:

> “Ke mana saya pergi balap?”

Menampilkan:

```text
LIAR
RESMI
CHAMPIONSHIP
HISTORY
```

---

# 137. PROFILE PAGE

Menjawab:

> “Apa yang sudah saya bangun?”

Menampilkan:

```text
Garage Reputation
Garage Level
Race Wins
Championship
Motors Built
Motors Sold
Customer Builds
Best Sale
```

---

# 138. GARAGE DASHBOARD

Contoh struktur:

```text
┌─────────────────────────────────────────┐
│ BENGKEL MALAM        Rp 18.450.000      │
│ REPUTATION ★ 42                         │
├─────────────────────────────────────────┤
│ GARAGE LV. 2                            │
│                                         │
│ [ MOTOR 01 ]       [ MOTOR 02 ]         │
│ Jatra 135          RX Project           │
│ 84%                31%                  │
│                                         │
├─────────────────────────────────────────┤
│ CUSTOMER                               │
│ 2 ACTIVE ORDERS                         │
│                                         │
│ TONIGHT                                │
│ Kediri Night Sprint                     │
└─────────────────────────────────────────┘
```

---

# 139. MOTOR DETAIL

```text
JATRA 135

[PIXEL MOTOR]

POWER        72
ACCELERATION 81
GRIP         69
RELIABILITY  77

BUILD SCORE 78

CONDITION GOOD
VALUE Rp 14M

[BUILD] [RACE] [SELL]
```

---

# 140. PART SCREEN

```text
ENGINE
Performance

Power +10
Acceleration +4
Reliability -6

Condition:
GOOD

[INSTALL]
```

---

# 141. RONGSOKAN SCREEN

```text
RONGSOKAN

PROJECT #044

GARUDA 150

Frame        GOOD
Engine       BROKEN
ECU          MISSING
Clutch       WORN
Body         POOR

Rp 3.2M

[INSPECT] [BUY]
```

---

# 142. CUSTOMER SCREEN

```text
ORDER #014

Motor:
Jatra 125

Request:
STREET BUILD

Budget:
Rp 6M

Target:
Build Score 68+

Reward:
Rp 8M

[ACCEPT]
```

---

# 143. JOKI SCREEN

```text
TEAM

RAKA
86 / 73 / 66
AGGRESSIVE

DITO
75 / 82 / 91
CONSISTENT

[SCOUT JOKI]
```

---

# 144. RACE SELECTION

```text
TONIGHT

LIAR
────────────────────

NIGHT SPRINT
Entry 500K
Prize 2.5M

HIGH STAKE
Entry 2M
Prize 8M

RESMI
────────────────────

STREET ROUND 4
Entry 1M
Prize 5M
```

---

# 145. PRE-RACE

```text
EVENT
STREET ROUND 4

YOUR MOTOR
Jatra 135

YOUR JOKI
Dito

RISK
[SAFE] [NORMAL] [PUSH]

[START RACE]
```

---

# 146. RACE HUD

```text
╔══════════════════════╗
║      8.421 SEC       ║
║                      ║
║ RPM                  ║
║ ███████████░         ║
║         ▲            ║
║      SHIFT           ║
║                      ║
║ [ SHIFT ]            ║
╚══════════════════════╝
```

---

# 147. RESULT

```text
1ST PLACE

8.421 SEC

+ Rp 5.000.000
+ 4 REP

MOTOR
91% → 85%

JOKI
+1 EXPERIENCE
```

---

# 148. MOTOR HISTORY

History penting tetapi ringan.

```text
PURCHASED
RESTORED
BUILT
RACED
WON
SOLD
```

---

# 149. MOTOR LEGACY

Contoh:

```text
GARUDA RX #017

Built:
Season 2

Races:
17

Wins:
9

Championship:
1

Sold:
Season 5
```

Ini menjadi cerita.

---

# 150. JOKI HISTORY

Contoh:

```text
RAKA

Races:
42

Wins:
16

Championships:
2

Total Podiums:
28
```

---

# 151. GARAGE HISTORY

Contoh:

```text
Season 1
Founded

Season 2
First Championship

Season 3
First Sponsor

Season 4
Garage Level 4
```

---

# 152. CAREER

BENGKEL MALAM tidak memiliki story campaign linear.

Career dibuat dari milestones.

```text
First Motor
First Build
First Customer
First Sale
First Race
First Win
First Sponsor
First Championship
```

---

# 153. ACHIEVEMENTS

Sedikit dan bermakna.

Contoh:

```text
FIRST BUILD
FIRST SALE
FIRST WIN
FIRST PROJECT
FIRST SPONSOR
FIRST CHAMPIONSHIP
10 CUSTOMER
50 SALES
```

---

# 154. COLLECTION

Optional.

```text
8 / 20 Motor Models
```

Koleksi bukan kewajiban.

---

# 155. SELLING VS KEEPING

Setiap motor idealnya menawarkan:

```text
KEEP
RACE
BUILD
SELL
```

Jangan membuat pemain otomatis mempertahankan semuanya.

---

# 156. CUSTOMER VS SELF PROJECT

Pemain sering harus memilih:

```text
Customer Build
```

atau:

```text
Own Project
```

Customer:

```text
safe profit
```

Project:

```text
uncertain profit
higher potential
```

Ini salah satu core decision paling penting.

---

# 157. RACE VS BUSINESS

Race:

```text
higher variance
higher reputation opportunity
motor wear
```

Business:

```text
more predictable
lower risk
```

---

# 158. MOTOR MARKET VS RONGSOKAN

Market:

```text
safer
more expensive
quick start
```

Rongsokan:

```text
cheap
riskier
higher potential margin
```

---

# 159. JOKI EXPENSIVE VS CHEAP

Joki mahal:

```text
better performance
higher fee
```

Joki murah:

```text
cheaper
less reliable
potential growth
```

---

# 160. POWER VS RELIABILITY

Build:

```text
POWER ↑
RELIABILITY ↓
```

atau:

```text
RELIABILITY ↑
POWER ↓
```

Trade-off ini muncul terus.

---

# 161. CLASS VS PERFORMANCE

Build lebih kuat tidak selalu lebih baik.

Contoh:

```text
Street 69
```

sangat efisien untuk Street.

Upgrade ke:

```text
Pro 72
```

lebih kuat tetapi kini berada di kompetisi lebih berat.

Ini mencegah progression terlalu linear.

---

# 162. ECONOMY PRINCIPLE

Tidak boleh ada:

```text
infinite money
```

Money harus terus mengalir:

```text
INCOME
↓
EXPENSE
↓
INVESTMENT
↓
PROFIT
```

---

# 163. MONEY SOURCES

```text
Customer
Motor Sale
Race
Sponsor
```

---

# 164. MONEY SINKS

```text
Motor
Parts
Repair
Mechanic
Joki
Race Entry
Garage Upgrade
```

---

# 165. NO SECONDARY CURRENCY

Tidak perlu:

```text
Coins
Gems
Energy
Tokens
Tickets
```

Gunakan satu mata uang:

# UANG.

---

# 166. PROFIT IS GAMEPLAY

Profit harus dapat dipahami.

Contoh:

```text
Bought      5M
Repair      1M
Parts       3M
----------------
Total       9M

Sell       13M
Profit      4M
```

Ini harus terlihat jelas.

---

# 167. DESIGNING FOR REPLAYABILITY

Replayability tidak datang dari:

```text
lebih banyak map
```

tetapi dari:

```text
different projects
different builds
different joki
different customer requests
different market rotation
different race conditions
```

---

# 168. RANDOM CONTENT POOL

Content random:

```text
Market
Customer
Joki
Liar Event
Rival
```

Tetapi core rules selalu konsisten.

---

# 169. NO PROCEDURAL WORLD GENERATION

Tidak diperlukan.

---

# 170. NO OPEN WORLD

Ini penting untuk menjaga scope.

Tidak ada:

```text
driving city
traffic
walking
police chase
building exploration
```

---

# 171. WORLD IS PRESENTED AS MENUS / SCENES

Kota hanya menjadi konteks.

Contoh:

```text
Arum
Wates
Malang
Pantura
```

sebagai event/race context.

Tidak harus dijelajahi secara fisik.

---

# 172. INDONESIAN CULTURE

Culture masuk melalui:

```text
nama
bahasa
desain bengkel
poster
spanduk
joki
customer
warung
komunitas
musik
event
```

Bukan simulasi sosial.

---

# 173. SETTING

Dunia adalah Indonesia versi fiktif.

Nama lokasi:

```text
ARUM
WATES
JAYA
SINDUR
PANTURA
```

---

# 174. EVENT NAMING

Contoh:

```text
Arum Night Sprint
Wates Garage Battle
Pantura Speed Meet
Jaya Street Cup
Sindur Performance Open
Nusantara Championship
```

---

# 175. SPONSOR NAMING

Fiktif:

```text
Nusa Performance
Garuda Parts
Maju Motor
Sinar Oil
Kopi Jalanan
Jaya Workshop Supply
```

---

# 176. CUSTOMER NAMING

Nama Indonesia biasa:

```text
Rian
Bagas
Doni
Adit
Fajar
Bayu
Raka
Dimas
```

---

# 177. UI LANGUAGE

Bahasa utama:

# Indonesia.

Istilah teknis dapat mempertahankan:

```text
Build
Stock
Project
Performance
Race
```

karena cocok dengan vocabulary otomotif.

---

# 178. TONE

Game harus:

```text
lokal
hangat
kompetitif
sedikit kasar
fun
nostalgic
```

Bukan:

```text
military
grim
cyberpunk
dark crime simulator
```

---

# 179. AUDIO

SFX:

```text
metal click
wrench
engine start
RPM
shift
cash
paper
garage door
```

---

# 180. MUSIC

Arah:

```text
retro
chiptune
garage rock
lo-fi
electronic
```

dengan flavor lokal.

---

# 181. MOTOR SPRITE

Setiap motor memiliki sprite sederhana.

State:

```text
stock
damaged
finished
```

Tidak perlu animasi kompleks.

---

# 182. GARAGE SPRITE

Garage memiliki visual states:

```text
Level 1
Level 2
Level 3
Level 4
Level 5
```

Jadi asset efisien.

---

# 183. WEB IMPLEMENTATION

Frontend:

```text
Astro
```

Game-heavy interaction:

```text
Vanilla JavaScript
```

Tidak wajib React/Svelte.

---

# 184. ASTRO ROLE

Astro menangani:

```text
Page Routing
Server Rendering
Layouts
Components
Static Content
Data Fetching
```

---

# 185. CLIENT SCRIPT ROLE

JS hanya untuk:

```text
Race Minigame
interactive build UI
tabs
filters
modals
small UI state
```

---

# 186. SERVER ROLE

Server menentukan:

```text
Money
Ownership
Build Result
Race Result
Joki Contract
Customer Completion
Garage Level
```

---

# 187. SERVER AUTHORITY

Browser tidak boleh mengatakan:

```text
"I won."
```

Browser hanya mengirim:

```text
player inputs
```

Server menentukan result.

---

# 188. SIMPLE PROJECT STRUCTURE

```text
bengkel-malam/
│
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── garage.astro
│   │   ├── motor.astro
│   │   ├── workshop.astro
│   │   ├── market.astro
│   │   ├── team.astro
│   │   ├── race.astro
│   │   └── profile.astro
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── garage/
│   │   ├── motor/
│   │   ├── workshop/
│   │   ├── market/
│   │   ├── team/
│   │   └── race/
│   │
│   ├── lib/
│   │   ├── game/
│   │   │   ├── motor.ts
│   │   │   ├── build.ts
│   │   │   ├── workshop.ts
│   │   │   ├── market.ts
│   │   │   ├── driver.ts
│   │   │   ├── race.ts
│   │   │   ├── sponsor.ts
│   │   │   └── progression.ts
│   │   │
│   │   ├── data/
│   │   │   ├── motors.ts
│   │   │   ├── parts.ts
│   │   │   ├── drivers.ts
│   │   │   ├── customers.ts
│   │   │   ├── races.ts
│   │   │   └── sponsors.ts
│   │   │
│   │   └── server/
│   │       ├── auth.ts
│   │       ├── player.ts
│   │       └── save.ts
│   │
│   └── styles/
│       ├── global.css
│       ├── pixel.css
│       └── game.css
│
├── public/
│   ├── images/
│   └── sounds/
│
├── drizzle/
├── tests/
├── astro.config.mjs
├── drizzle.config.ts
├── package.json
└── README.md
```

---

# 189. GAME MODULES

Core modules:

```text
motor.ts
build.ts
workshop.ts
market.ts
driver.ts
race.ts
sponsor.ts
progression.ts
```

Tidak perlu architecture enterprise.

---

# 190. MOTOR MODULE

Bertanggung jawab pada:

```text
condition
value
performance
parts
class
```

---

# 191. BUILD MODULE

Bertanggung jawab:

```text
install
remove
calculate score
calculate quality
calculate value
```

---

# 192. WORKSHOP MODULE

Bertanggung jawab:

```text
repair
customer orders
mechanic
service
build jobs
```

---

# 193. MARKET MODULE

Bertanggung jawab:

```text
motor listings
parts
salvage
sale
```

---

# 194. DRIVER MODULE

Bertanggung jawab:

```text
scouting
signing
driver stats
driver progression
```

---

# 195. RACE MODULE

Bertanggung jawab:

```text
eligibility
track
risk
race calculation
reward
result
```

---

# 196. SPONSOR MODULE

Bertanggung jawab:

```text
offer
objective
progress
reward
```

---

# 197. PROGRESSION MODULE

Bertanggung jawab:

```text
garage level
reputation
unlock
```

---

# 198. DATABASE

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
customer_orders
races
race_results
sponsors
sponsor_contracts
transactions
```

---

# 199. USERS

Authentication identity.

---

# 200. PLAYERS

```text
id
user_id
name
cash
reputation
garage_level
```

---

# 201. GARAGES

```text
id
player_id
level
motor_capacity
order_capacity
driver_capacity
mechanic_capacity
```

---

# 202. MOTORS

```text
id
player_id
model
name
condition
build_score
market_value
race_wins
race_starts
```

---

# 203. PARTS

```text
id
name
category
quality
performance
price
```

---

# 204. MOTOR_PARTS

```text
motor_id
part_id
condition
```

---

# 205. DRIVERS

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

# 206. CUSTOMER ORDERS

```text
id
player_id
motor_id
type
budget
target_score
reward
satisfaction
status
```

---

# 207. RACES

```text
id
name
mode
class
distance
difficulty
condition
entry_fee
prize
```

---

# 208. RACE RESULTS

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
```

---

# 209. TRANSACTIONS

Setiap money mutation:

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

---

# 210. NO NEED FOR REDIS IN MVP

Tidak dibutuhkan pada awal.

---

# 211. NO NEED FOR WEBSOCKETS IN MVP

Race bukan realtime multiplayer.

---

# 212. NO NEED FOR EVENT BUS

Core systems dapat memanggil fungsi langsung.

---

# 213. NO NEED FOR WORKER CLUSTER

Scheduled maintenance sederhana sudah cukup.

---

# 214. OPTIONAL BACKGROUND JOBS

Hanya untuk:

```text
market refresh
season transitions
cleanup
notification
```

Bukan untuk membatasi gameplay.

---

# 215. TESTING

Unit test utama:

```text
Build calculation
Motor value
Race calculation
Customer payout
Transaction
Garage capacity
Class eligibility
```

---

# 216. BALANCING SHEET

Setiap motor:

```text
Base Price
Power
Acceleration
Grip
Reliability
Build Potential
Expected Sale
```

Setiap part:

```text
Price
Power
Acceleration
Grip
Reliability
```

Setiap race:

```text
Entry
Prize
Difficulty
Track Type
Class
```

---

# 217. ECONOMIC HEALTH CHECK

Setiap aktivitas harus diketahui:

```text
Expected Cost
Expected Reward
Expected Margin
```

Jangan ada sumber uang yang secara matematis selalu dominan.

---

# 218. NO SINGLE BEST STRATEGY

Tidak boleh ada:

> satu motor yang selalu terbaik.

Tidak boleh ada:

> satu joki yang selalu terbaik.

Tidak boleh ada:

> satu race yang selalu menghasilkan uang paling banyak.

Tidak boleh ada:

> satu build yang selalu menang.

---

# 219. ANTI-META: RACE

Different track:

```text
Short
Long
Technical
```

Different preference.

---

# 220. ANTI-META: ECONOMY

Different customer:

```text
High volume
High margin
High quality
```

---

# 221. ANTI-META: MOTOR

Different base model:

```text
cheap
balanced
high potential
```

---

# 222. ANTI-META: JOKI

Different:

```text
reaction
shift
consistency
```

---

# 223. REPLAYABILITY ENGINE

Replayability berasal dari:

```text
different market
different project
different customers
different joki
different season
different decisions
```

---

# 224. NO HARD RESET

Season selesai, player tidak kehilangan garage.

History terus bertambah.

---

# 225. CAREER HISTORY

History:

```text
Season
Garage Level
Championship
Major Motor
Major Sale
Major Joki
```

---

# 226. ENDGAME

Endgame:

```text
Legendary Garage
Rare Projects
Championships
Motor Collection
Best Joki
Best Sale
Best Race Record
```

---

# 227. LEGENDARY GARAGE

Contoh:

```text
BENGKEL MALAM

Garage Level:
5

Reputation:
94

Championship:
7

Race Wins:
81

Customer Builds:
438

Motors Sold:
197

Best Sale:
Rp 42M

Legendary Motor:
GARUDA RX #017

Legendary Joki:
RAKA
```

---

# 228. SINGLE-PLAYER FIRST

MVP:

```text
Player
+
AI Rivals
```

Tidak perlu live players.

---

# 229. ASYNC MULTIPLAYER FUTURE

Baru kemudian:

```text
Leaderboard
Time Attack
Garage Showcase
Motor Showcase
Player Market
```

---

# 230. LEADERBOARD

Kategori:

```text
Best Time
Most Championships
Most Profitable Garage
Most Motor Sales
```

Tidak perlu social MMO.

---

# 231. GARAGE SHOWCASE

Player dapat mempublikasikan:

```text
Garage
Favorite Motor
Best Joki
Best Build
```

---

# 232. FUTURE PLAYER MARKET

Jika game berhasil:

```text
Player lists Motor
Other player buys
Ownership changes
```

Tetap menggunakan motor entity yang sama.

---

# 233. DESIGN PRINCIPLE: OBJECT REUSE

Satu:

```text
MOTOR
```

digunakan oleh:

```text
Garage
Customer
Market
Race
Sale
History
```

Satu:

```text
PART
```

digunakan oleh:

```text
Market
Build
Customer
Motor
Sale
```

Ini membuat architecture sederhana.

---

# 234. DESIGN PRINCIPLE: BUSINESS FIRST

Kalau fitur baru hanya menambah:

```text
cool animation
```

tetapi tidak menambah:

```text
decision
```

fitur tersebut bukan prioritas.

---

# 235. DESIGN PRINCIPLE: DECISION OVER WAIT

Jangan membuat:

> “tunggu.”

Buat:

> “pilih.”

---

# 236. CONTOH

Buruk:

```text
Repair takes 30 minutes.
```

Bagus:

```text
Repair:
300K

Replace:
900K
```

Pemain memilih.

---

# 237. CONTOH

Buruk:

```text
Wait for training.
```

Bagus:

```text
Use Joki
→ race
→ experience
→ improvement
```

---

# 238. CONTOH

Buruk:

```text
Wait for market refresh.
```

Bagus:

```text
Current Market
+
Available Purchases
```

Market refresh hanya merupakan event dunia.

---

# 239. SESSION DESIGN

Dalam 5 menit:

```text
Check Garage
Buy Project
Install Part
```

Dalam 10 menit:

```text
Complete Customer
Race
Sell Part
```

Dalam 20–30 menit:

```text
Build Motor
Race
Earn
Reinvest
```

Tidak ada batas session.

---

# 240. DAILY FEEL

Saat login:

```text
Apa motor menarik yang tersedia?
Apa customer menarik?
Apakah ada race bagus?
Apa yang bisa saya jual?
```

---

# 241. NOTIFICATION

Hanya:

```text
Customer Completed
Race Starting
Sponsor Objective
New Market
```

---

# 242. NO SPAM

Jangan:

```text
10 notifications
```

dalam satu session.

---

# 243. FIRST 10 MINUTES

Tutorial harus menunjukkan:

```text
Buy used motor
Inspect
Repair
Install part
Race
Sell
```

Bukan menjelaskan 20 menu.

---

# 244. FIRST HOUR

Pemain mengalami:

```text
Garage Level 1
First Customer
First Project
First Joki
First Official Race
```

---

# 245. FIRST SEASON

Pemain:

```text
build garage
complete customer
race
sell motor
hire joki
try championship
```

---

# 246. FIRST LONG-TERM GOAL

Tujuan pertama:

> **Naikkan bengkel dari Garasi Kecil menjadi Bengkel.**

Bukan level player.

---

# 247. SECOND GOAL

> **Menemukan motor project yang menghasilkan profit besar.**

---

# 248. THIRD GOAL

> **Menang championship pertama.**

---

# 249. FOURTH GOAL

> **Membangun garage level tinggi.**

---

# 250. FINAL GOAL

> **Menciptakan garage dengan sejarah dan identitas sendiri.**

---

# 251. EXAMPLE COMPLETE SESSION

Pemain login.

Cash:

```text
Rp 11M
```

Reputation:

```text
32
```

Motor:

```text
Jatra 135
Condition 72%
```

Market:

```text
Garuda 150 Used — 9M
Merapi Project — 3M
```

Pemain memilih:

```text
Merapi Project
```

---

# 252. INSPECTION

```text
Frame GOOD
Engine BROKEN
ECU MISSING
Clutch WORN
Body POOR
```

Pemain menghitung:

```text
3M purchase
2M engine
1M ECU
500K clutch
500K repair
```

Total:

```text
7M
```

---

# 253. BUILD DECISION

Pemain punya sisa:

```text
4M
```

Tidak bisa memasang semua part.

Pilih:

```text
Street ECU
Sport Clutch
Basic Tire
```

Build Score:

```text
68
```

---

# 254. DECISION

Pemain punya tiga pilihan:

```text
Sell
Race
Keep
```

Pemain memilih:

```text
Race
```

---

# 255. RACE

Memilih:

```text
Joki:
Dito

Risk:
Normal
```

Minigame:

```text
Perfect Launch
Good Shift
Perfect Shift
Good Shift
```

Finish:

```text
2nd
```

---

# 256. RESULT

```text
Prize:
Rp 3M

Reputation:
+3

Motor Condition:
91 → 84
```

Sekarang pemain memiliki:

```text
Rp 7M
```

dan motor bernilai:

```text
Rp 12M
```

---

# 257. NEXT DECISION

Pemain dapat:

```text
Repair
Sell
Race Again
```

Ini adalah game.

Tidak perlu energy.

---

# 258. CUSTOMER EXAMPLE

Customer:

```text
Jatra 125

Request:
Street Build

Budget:
6M

Reward:
8M
```

Pemain menggunakan:

```text
3.5M parts
```

Profit:

```text
4.5M
```

Satisfaction:

```text
91
```

Reputation:

```text
+2
```

---

# 259. MARKET EXAMPLE

Pemain melihat:

```text
Garuda 150
USED
Condition 48%
Rp 7M
```

Pemain tahu:

```text
Repair:
1M

Potential Value:
11M
```

Dia membeli.

Itulah gameplay.

---

# 260. THE MASTER LOOP

Seluruh game akhirnya:

```text
             MARKET
                │
                ↓
             MOTOR
                │
        ┌───────┼────────┐
        ↓       ↓        ↓
      REPAIR   BUILD    SELL
        │       │        │
        └───┬───┘        │
            ↓            │
         BENGKEL         │
            │            │
      ┌─────┼─────┐      │
      ↓     ↓     ↓      │
 CUSTOMER JOKI  RACE     │
      │     │     │      │
      └─────┼─────┘      │
            ↓            │
          MONEY ←─────────┘
            │
            ↓
       GARAGE GROWTH
            │
            ↓
       BETTER ACCESS
            │
            ↓
          MARKET
```

---

# 261. CORE ECONOMIC LOOP

```text
BUY
↓
INVEST
↓
BUILD
↓
SELL
↓
PROFIT
↓
REINVEST
```

---

# 262. CORE RACING LOOP

```text
BUILD
↓
JOKI
↓
RACE
↓
TIMING
↓
RESULT
↓
REWARD
```

---

# 263. CORE CUSTOMER LOOP

```text
ORDER
↓
BUILD
↓
DELIVER
↓
PAY
↓
REPUTATION
↓
BETTER ORDER
```

---

# 264. CORE PROGRESSION LOOP

```text
PROFIT
+
REPUTATION
↓
GARAGE LEVEL
↓
CAPACITY
↓
BETTER CONTENT
↓
BETTER OPPORTUNITIES
```

---

# 265. CORE EMOTIONAL LOOP

```text
“Ini motor jelek.”
↓
“I think I can save it.”
↓
“Build-nya jadi.”
↓
“Wah bagus.”
↓
“Coba balap.”
↓
“MENANG.”
↓
“Jangan dijual dulu.”
```

Ini rasa yang harus dicapai game.

---

# 266. MOTOR YANG BISA MENJADI KARAKTER

Motor harus mempunyai identity melalui:

```text
Model
Build
Condition
History
Wins
```

Satu motor dapat menjadi favorit pemain.

---

# 267. JOKI YANG BISA MENJADI KARAKTER

Joki melalui:

```text
Name
Stats
Trait
Wins
History
```

Pemain dapat memiliki:

> “Joki pertama saya.”

---

# 268. GARAGE YANG BISA MENJADI KARAKTER

Garage melalui:

```text
Level
Reputation
History
Motors
Championship
```

---

# 269. NO MAIN STORY

Tidak diperlukan main quest.

Cerita berasal dari:

```text
Motor
Customer
Joki
Race
Money
```

---

# 270. NO COMPLEX SOCIAL SIMULATION

Tidak perlu:

```text
NPC memory
Faction
Alliance
Territory
Political power
```

---

# 271. NO WORLD SIMULATION

Tidak perlu:

```text
dynamic society
economic AI
daily NPC simulation
```

---

# 272. NO COMPLEX CRIME SIMULATION

Mode liar tetap menjadi game mode abstrak.

Jangan membangun:

```text
police evasion
real-world street racing tutorial
```

Fokus:

```text
stakes
race
result
```

---

# 273. DESIGN QUALITY TEST

Setiap fitur baru ditanyakan:

```text
1. Apakah ini memperkuat bengkel?
2. Apakah ini memperkuat motor?
3. Apakah ini memperkuat bisnis?
4. Apakah ini memperkuat racing?
5. Apakah ini menciptakan pilihan?
```

Jika jawabannya mayoritas “tidak”:

> fitur tidak diprioritaskan.

---

# 274. COMPLEXITY TEST

Setiap sistem baru juga ditanya:

```text
Apakah saya bisa mencapai efek yang sama
dengan memperdalam sistem lama?
```

Kalau iya:

> jangan buat sistem baru.

---

# 275. DEVELOPMENT RULE

Jangan membuat:

```text
feature
→ UI
→ database
→ API
```

kemudian baru mencari gameplay.

Urutan harus:

```text
DESIGN RULE
↓
GAME LOGIC
↓
DATA
↓
UI
```

---

# 276. MVP

MVP absolut:

```text
Garage
3 Motors
12 Components
10 Parts
2 Joki
5 Customer Orders
3 Salvage Projects
3 Liar Races
3 Official Races
1 Official Class
Motor Trading
Repair
Build
Race Minigame
Money
Reputation
```

---

# 277. MVP TEST

Pertanyaan:

> Apakah membeli project → build → race → sell menyenangkan?

Kalau belum:

**jangan tambah feature.**

---

# 278. V0.2

Tambahkan:

```text
Customer
Joki
Official Class
```

---

# 279. V0.3

Tambahkan:

```text
Sponsors
Garage Levels
Championship
```

---

# 280. V0.4

Tambahkan:

```text
More Motors
More Parts
More Customer Templates
More Races
```

---

# 281. V1.0

```text
Garage
Motor
Parts
Salvage
Trading
Customer
Joki
Liar
Official
Championship
Sponsor
Progression
History
Leaderboard
```

---

# 282. POST-1.0

Baru pertimbangkan:

```text
Async Player Market
Garage Showcase
Time Attack
Player Challenges
Season Events
```

---

# 283. FEATURE YANG HARUS DIHINDARI

Jangan terlalu cepat membuat:

```text
Open World
Realtime Multiplayer
Complex AI
Complex NPC
Faction
Territory
Player Politics
Huge Skill Tree
Multiple Currency
Energy
Cooldown
Crafting Tree
```

---

# 284. FINAL GAME IDENTITY

BENGKEL MALAM harus terasa seperti:

> **game tentang sebuah bengkel yang tumbuh bersama motor-motornya.**

Bukan:

> menu simulator dengan banyak angka.

---

# 285. FINAL UI IDENTITY

UI harus terasa seperti gabungan:

```text
Pixel Game
+
Garage Sign
+
Pit Board
+
Workshop Receipt
+
Part Catalog
+
Race Timing Board
```

---

# 286. FINAL VISUAL IDENTITY

Bayangkan:

```text
malam
lampu bengkel
lantai beton
motor di stand
toolbox
stiker sponsor
spanduk event
tumpukan ban
rak spare part
layar CRT/pixel
```

Tetapi seluruhnya diwujudkan dalam visual pixel yang ringan.

---

# 287. FINAL PLAYER JOURNEY

```text
GARASI KECIL
↓
BELI MOTOR BEKAS
↓
SERVICE
↓
CUSTOMER
↓
RACE PERTAMA
↓
PROJECT PERTAMA
↓
JOKI PERTAMA
↓
MOTOR DIJUAL
↓
GARAGE NAIK LEVEL
↓
SPONSOR
↓
OFFICIAL CLASS
↓
CHAMPIONSHIP
↓
GARAGE TERKENAL
```

---

# 288. FINAL LONG-TERM JOURNEY

```text
Nobody
↓
Small Garage
↓
Local Workshop
↓
Known Builder
↓
Race Garage
↓
Established Garage
↓
Renowned Garage
↓
Legendary Garage
```

---

# 289. FINAL PLAYER QUESTIONS

Game harus terus membuat pemain berpikir:

> “Beli atau simpan?”

> “Repair atau replace?”

> “Build atau sell?”

> “Customer atau project?”

> “Joki murah atau joki mahal?”

> “Street atau Pro?”

> “Safe atau Push?”

> “Race atau bisnis?”

Ini adalah sumber kedalaman utama.

---

# 290. FINAL DESIGN LAW

> **Dalam BENGKEL MALAM, setiap resource harus menghadirkan pilihan.**

Uang:

```text
Part / Motor / Joki / Garage
```

Motor:

```text
Build / Race / Sell
```

Joki:

```text
Race / Invest
```

Garage Capacity:

```text
Customer / Project
```

Race:

```text
Reward / Wear
```

---

# 291. FINAL ANTI-BOREDOM LAW

Jangan membuat:

> “Tidak bisa bermain.”

Buat:

> **“Bisa bermain banyak hal, tetapi saya harus memilih mana yang paling menguntungkan sekarang.”**

---

# 292. FINAL ANTI-GRIND LAW

Pemain tidak boleh merasa:

> “Saya harus melakukan hal yang sama 200 kali.”

Variasi harus datang dari:

```text
market
project
customer
race
joki
build
```

---

# 293. FINAL IMMERSION LAW

Pemain harus dapat menunjuk sesuatu dan berkata:

> “Ini motor saya.”

> “Ini joki saya.”

> “Ini bengkel saya.”

> “Ini hasil build saya.”

> “Ini motor yang pernah menang.”

---

# 294. FINAL ECONOMIC LAW

Tidak ada income tanpa:

```text
action
decision
risk
```

Bahkan passive-looking income tetap harus berasal dari business action pemain.

---

# 295. FINAL TECHNICAL LAW

Sistem game harus dapat dijelaskan dengan:

```text
Motor
Parts
Driver
Customer
Race
Garage
Money
Reputation
```

Jika sebuah feature membutuhkan sepuluh entity baru, kita harus bertanya apakah feature tersebut memang diperlukan.

---

# 296. FINAL SCOPE LAW

**Depth > Breadth.**

Lebih baik:

```text
20 motor
```

yang semuanya punya:

```text
buy
repair
build
race
sell
history
```

daripada:

```text
200 motor
```

yang hanya menjadi card dengan angka.

---

# 297. FINAL DESIGN STATEMENT

> **BENGKEL MALAM adalah garage management game berbasis pixel-art tentang kultur otomotif Indonesia fiktif, di mana pemain membangun bengkel dari kecil menjadi garasi terkenal dengan mencari dan membeli motor stock, bekas, maupun proyek rongsokan; memperbaiki, membongkar, merakit, dan memodifikasi komponennya; menerima pekerjaan customer; merekrut dan mengelola joki; menjual motor untuk profit; serta membawa hasil build ke balap liaran dan kompetisi resmi berbasis kelas dan championship.**

---

# 298. FINAL CORE

```text
                 BENGKEL
                    │
        ┌───────────┼───────────┐
        │           │           │
        ↓           ↓           ↓
      MOTOR      CUSTOMER      TEAM
        │           │           │
        ↓           ↓           ↓
      BUILD       SERVICE      JOKI
        │           │           │
        └──────┬────┴─────┬─────┘
               │          │
               ↓          ↓
             MARKET      RACE
               │       ┌──┴──┐
               │       ↓     ↓
               │     LIAR  RESMI
               │             │
               └──────┬──────┘
                      ↓
                    MONEY
                      ↓
                 GARAGE GROWTH
                      ↓
                    REPEAT
```

---

# 299. FINAL GAME FEEL

Pemain membuka game dan melihat:

> **“Ada project murah.”**

Pemain membeli.

> **“Ternyata engine rusak.”**

Pemain memperbaiki.

> **“Budget saya tinggal sedikit.”**

Pemain memilih build.

> **“Build Score 68. Masih Street.”**

Pemain mencari joki.

> **“Raka mahal, tapi cocok.”**

Pemain masuk race.

> **“Push.”**

Minigame dimulai.

> **PERFECT LAUNCH.**

> **PERFECT SHIFT.**

Menang.

Pemain kembali ke bengkel.

> **“Motor ini saya jual saja. Profit-nya bisa buat project berikutnya.”**

Inilah pengalaman yang menjadi tujuan utama.

---

# 300. THE FINAL SENTENCE

> **BENGKEL MALAM bukan tentang memiliki motor paling mahal. BENGKEL MALAM adalah tentang mengetahui motor mana yang layak dibeli, bagian mana yang layak diperbaiki, build mana yang layak dibuat, orang mana yang layak dipercaya membawa motor, dan kapan sebuah motor lebih baik dijual daripada dibawa menang.**

---

# 301. THE ABSOLUTE FOUNDATION

Untuk seluruh development berikutnya, fondasi BENGKEL MALAM dianggap:

```text
BENGKEL
MOTOR
PARTS
CUSTOMER
JOKI
MARKET
RACE
MONEY
REPUTATION
GARAGE PROGRESSION
```

Dan seluruh dunia harus berputar di antara sembilan hal tersebut.

**Tidak lebih besar dari yang diperlukan.**

**Tidak lebih sederhana dari yang membuat keputusan kehilangan makna.**
