# BENGKEL MALAM

## RACIK. JUAL. BALAP.

### Master Game Design Document

### Local-First Single-Player Foundation

---

# 00. MASTER VISION

**BENGKEL MALAM** adalah game management otomotif berbasis web dengan pixel-art penuh, bertema kultur bengkel dan drag Indonesia fiktif.

Pemain memulai dari sebuah bengkel kecil.

Pemain:

```text
mencari motor
↓
membeli motor
↓
memeriksa kondisi
↓
memperbaiki
↓
membongkar
↓
memasang part
↓
membangun motor
↓
menggunakan / menjual motor
↓
mengelola customer
↓
merekrut joki
↓
mengikuti balap
↓
mendapat uang dan reputasi
↓
mengembangkan bengkel
```

Game memiliki dua jalur racing:

```text
LIAR
RESMI
```

Tetapi **racing bukan satu-satunya tujuan**.

Pemain dapat menjadi:

```text
dealer
builder
mekanik
business owner
race team
project hunter
hybrid
```

Semua itu terjadi dalam satu ekosistem bengkel.

---

# 01. CORE PLAYER FANTASY

Pemain harus merasa:

> **“Ini bengkel saya.”**

Bukan:

> “Ini karakter level 53 saya.”

Pemain juga harus merasa:

> **“Motor ini saya bangun.”**

Bukan:

> “Item ini mempunyai +15 stat.”

Dan:

> **“Joki ini saya pilih untuk motor ini.”**

Bukan:

> “NPC #12 mempunyai 87 speed.”

Game harus mengubah angka menjadi sesuatu yang terasa mempunyai identitas.

---

# 02. FINAL DESIGN SENTENCE

> **Beli motor murah. Hidupkan kembali. Tentukan tujuan build-nya. Pilih siapa yang membawanya. Jual kalau menguntungkan, atau bawa ke lintasan untuk membuktikannya. Gunakan hasilnya untuk membangun bengkel yang lebih besar.**

Ini adalah kalimat yang menjadi filter untuk semua fitur.

---

# 03. TARGET EXPERIENCE

BENGKEL MALAM harus bisa dimainkan dalam:

```text
5 menit
15 menit
30 menit
1 jam
berjam-jam
```

Tanpa mengubah core system.

Pemain bebas berhenti kapan saja.

Saat kembali, selalu ada peluang baru:

```text
project
customer
race
market
build
joki
challenge
```

---

# 04. FUNDAMENTAL DESIGN LAWS

## Law 01 — No Energy

Tidak ada Energy.

## Law 02 — No Nerve

Tidak ada Nerve.

## Law 03 — No Universal Stamina

Tidak ada resource yang membatasi seluruh aktivitas.

## Law 04 — No Gameplay Waiting

Tidak ada:

```text
repair 2 hours
training 4 hours
build 6 hours
```

## Law 05 — Choice Over Waiting

Batas permainan berasal dari:

```text
money
capacity
condition
class
opportunity
```

## Law 06 — Every Object Has Multiple Uses

Motor bukan hanya untuk race.

Joki bukan hanya untuk race.

Uang bukan hanya untuk upgrade.

## Law 07 — Veteran Players Need Different Goals

Early:

```text
money
```

Mid:

```text
garage growth
```

Late:

```text
competition
```

Endgame:

```text
mastery
collection
records
legacy
```

---

# 05. LOCAL-FIRST FOUNDATION

Versi pertama BENGKEL MALAM adalah:

```text
LOCAL / SINGLE PLAYER
```

Seluruh sistem dapat dimainkan tanpa:

```text
PvP
WebSocket
Realtime Server
Player Marketplace
Online Leaderboard
```

Database lokal/persistent digunakan untuk save state.

Semua gameplay rule tetap dirancang agar kelak dapat dipindahkan ke server tanpa membuang desain.

---

# 06. WHY LOCAL FIRST

Local-first memberikan:

```text
development lebih sederhana
debug lebih mudah
balancing lebih mudah
tidak bergantung server
tidak perlu anti-cheat kompleks
tidak membutuhkan realtime infrastructure
```

Fokus awal:

> **buat gamenya benar-benar menyenangkan terlebih dahulu.**

---

# 07. FUTURE ONLINE LAYER

Setelah core game terbukti:

```text
LOCAL GAME
      ↓
ONLINE PROFILE
      ↓
LEADERBOARD
      ↓
ASYNC RACE
      ↓
PLAYER MARKET
      ↓
GARAGE SHOWCASE
      ↓
PVP
```

Online adalah extension.

Bukan fondasi.

---

# 08. FOUR CORE PILLARS

Semua game berada di bawah:

```text
BENGKEL
MOTOR
BISNIS
BALAP
```

---

# 09. PILLAR 1 — BENGKEL

Bengkel adalah:

```text
home
workshop
inventory hub
business center
team center
progression hub
```

Semua kembali ke sini.

---

# 10. PILLAR 2 — MOTOR

Motor adalah objek utama.

Motor dapat:

```text
dibeli
dijual
diperiksa
diperbaiki
dibongkar
dipasang
dibangun
dituning
dipakai race
dikoleksi
dipensiunkan
```

---

# 11. PILLAR 3 — BISNIS

Bengkel menghasilkan income melalui:

```text
service
repair
customer build
motor sale
project flip
race
sponsor
```

---

# 12. PILLAR 4 — BALAP

Balap adalah:

```text
skill expression
build validation
reputation
competition
reward
```

---

# 13. THE GOLDEN LOOP

```text
MARKET
↓
MOTOR
↓
REPAIR
↓
BUILD
↓
TEST
↓
RACE / SELL
↓
MONEY
↓
GARAGE
↓
BETTER ACCESS
↓
MARKET
```

---

# 14. SECONDARY LOOP

```text
CUSTOMER
↓
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
BETTER CUSTOMER
```

---

# 15. TEAM LOOP

```text
SCOUT
↓
SIGN JOKI
↓
ASSIGN MOTOR
↓
RACE
↓
EXPERIENCE
↓
BETTER JOKI
```

---

# 16. CAREER LOOP

```text
GARAGE LEVEL
↓
MORE CAPACITY
↓
MORE OPPORTUNITIES
↓
MORE MONEY
↓
MORE REPUTATION
↓
BETTER GARAGE
```

---

# 17. MOTOR SYSTEM

Setiap motor adalah persistent entity.

Motor memiliki:

```text
ID
MODEL
NAME
CONDITION
BUILD SCORE
MARKET VALUE
PARTS
RACE HISTORY
SALE HISTORY
```

---

# 18. MOTOR CONDITION

Gunakan status sederhana:

```text
EXCELLENT
GOOD
WORN
POOR
BROKEN
```

Internal system boleh menggunakan numerical condition.

Player-facing presentation menggunakan status yang mudah dibaca.

---

# 19. MOTOR SOURCES

Motor datang dari:

```text
STOCK
USED
SALVAGE
CUSTOM BUILD
```

---

# 20. STOCK MOTOR

Motor siap digunakan.

```text
harga tinggi
condition bagus
performance standar
```

Untuk pemain yang ingin langsung bermain.

---

# 21. USED MOTOR

```text
harga lebih murah
condition menengah
potensi build
```

---

# 22. SALVAGE MOTOR

Motor project:

```text
sangat murah
banyak part bermasalah
potential value tinggi
```

Ini menjadi hunting loop utama.

---

# 23. CUSTOM BUILD MOTOR

Motor hasil tangan pemain.

```text
parts
tuning
quality
history
```

---

# 24. MOTOR COMPONENTS

Gunakan sekitar 12 komponen.

```text
1. Engine
2. Engine Head
3. ECU
4. Carburetor / Injection
5. Transmission
6. Clutch
7. Exhaust
8. Front Tire
9. Rear Tire
10. Brake
11. Suspension
12. Body
```

Tidak perlu 50+ component.

---

# 25. COMPONENT STATES

Setiap part:

```text
GOOD
WORN
BROKEN
```

---

# 26. PART QUALITY

```text
STOCK
AFTERMARKET
PERFORMANCE
SPECIAL
```

---

# 27. PART STATS

Setiap part hanya memengaruhi:

```text
POWER
ACCELERATION
GRIP
RELIABILITY
```

---

# 28. PART ACTIONS

Player bisa:

```text
INSPECT
INSTALL
REMOVE
REPAIR
REPLACE
SELL
```

---

# 29. REPAIR VS REPLACE

Part WORN:

```text
repair murah
```

Part BROKEN:

```text
replace mahal
```

Ini menciptakan economic decision.

---

# 30. BUILD SYSTEM

Build adalah:

```text
BASE MOTOR
+
PARTS
+
QUALITY
+
CONDITION
+
TUNING
```

---

# 31. BUILD STYLES

Game dapat membaca build secara otomatis:

```text
STREET
DRAG
BALANCED
POWER
RELIABLE
```

Hanya sebagai label.

Bukan class permanen.

---

# 32. TUNING

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

# 33. BUILD SCORE

Satu agregat:

```text
BUILD SCORE
```

Contoh:

```text
74
```

Dipakai untuk:

```text
class
customer target
market valuation
race eligibility
```

---

# 34. BUILD QUALITY

Hasil:

```text
STANDARD
GOOD
EXCELLENT
MASTER
```

---

# 35. GARAGE BONUS

Garage level dan mechanic dapat memberikan:

```text
build quality
repair efficiency
```

---

# 36. MOTOR MARKET

Market menyediakan:

```text
motor
parts
salvage
```

---

# 37. MARKET ROTATION

Market tidak statis.

Setiap refresh:

```text
motor list berubah
part list berubah
project list berubah
```

Tetapi refresh bukan cooldown gameplay.

Player tetap dapat melakukan aktivitas lain.

---

# 38. RONGSOKAN

Menu:

# RONGSOKAN

Menampilkan project dengan:

```text
model
frame condition
engine condition
missing parts
price
potential
```

---

# 39. RONGSOKAN AS HUNTING

Player belajar:

```text
mana murah
mana overprice
mana punya potential
```

Skill player menjadi bagian dari economy.

---

# 40. PROJECT FLIPPING

Loop:

```text
BUY
↓
REPAIR
↓
BUILD
↓
SELL
```

Profit menjadi gameplay.

---

# 41. BUILD-TO-SELL

Player dapat membuat motor khusus untuk dijual.

```text
cost
vs
market value
```

---

# 42. MOTOR VALUE

Formula konseptual:

```text
Market Value =
Base Value
× Condition
× Build Quality
× Parts
× History
× Market Modifier
```

---

# 43. MOTOR HISTORY

Simpan milestone:

```text
Purchased
Restored
Built
Raced
Won
Sold
```

---

# 44. MOTOR LEGACY

Motor dengan history tinggi dapat menjadi:

```text
FAVORITE
VETERAN
CHAMPION
LEGEND
```

---

# 45. RETIRE MOTOR

Player dapat menandai motor:

# RETIRED

Motor masuk:

```text
Garage Display
Hall of Fame
History
```

Motor retired tidak hilang.

---

# 46. CUSTOMER SYSTEM

Customer adalah income engine.

Customer datang dengan:

```text
motor
request
budget
target
reward
```

---

# 47. CUSTOMER JOB TYPES

Lima:

```text
SERVICE
REPAIR
RESTORATION
STREET BUILD
RACE BUILD
```

---

# 48. SERVICE

Contoh:

```text
Basic Service
Full Service
Tune
```

---

# 49. REPAIR JOB

Customer menyerahkan motor.

Player memperbaiki.

Payment langsung.

---

# 50. RESTORATION JOB

Customer memberikan project.

Player mengembalikan condition.

Reward lebih besar.

---

# 51. BUILD JOB

Customer:

```text
Budget 6M
Target Build Score 70
```

Player mencari solusi.

---

# 52. RACE BUILD JOB

Customer meminta:

```text
Street
Pro
Open
```

Player membangun motor sesuai class.

---

# 53. CUSTOMER ECONOMICS

Contoh:

```text
Customer Budget
Rp 6M

Parts
Rp 3.5M

Profit
Rp 2.5M
```

Jika player overspends:

```text
profit kecil
```

---

# 54. CUSTOMER SATISFACTION

Satu angka:

```text
0–100
```

Dipengaruhi:

```text
Target
Quality
Cost
```

---

# 55. CUSTOMER REPUTATION EFFECT

Satisfaction tinggi:

```text
reputation ↑
```

Satisfaction rendah:

```text
reputation ↓
```

---

# 56. MECHANIC SYSTEM

Mechanic adalah staff simple.

Data:

```text
Name
Specialty
Skill
Salary
```

---

# 57. MECHANIC SPECIALTIES

```text
ENGINE
ELECTRICAL
TUNING
GENERAL
```

---

# 58. MECHANIC PURPOSE

Mechanic dapat meningkatkan:

```text
Build Quality
Repair Efficiency
```

Tidak ada AI movement.

---

# 59. STAFF CAPACITY

Garage menentukan:

```text
Mechanic Slots
```

Player memilih siapa yang direkrut.

---

# 60. JOKI SYSTEM

Joki adalah talent yang dikelola.

Player:

```text
Scout
Sign
Assign
Race
Develop
Release
```

---

# 61. JOKI ATTRIBUTES

Hanya tiga:

```text
REACTION
SHIFT
CONSISTENCY
```

---

# 62. JOKI TRAITS

Lima:

```text
AGGRESSIVE
TECHNICAL
CONSISTENT
COMEBACK
ROOKIE
```

---

# 63. JOKI ECONOMICS

```text
Signing Fee
Race Fee
```

Tidak ada salary simulation rumit.

---

# 64. JOKI PROGRESSION

Race menghasilkan experience.

Milestone meningkatkan skill.

Tidak perlu waiting.

---

# 65. JOKI REPUTATION

Joki mempunyai:

```text
Driver Reputation
```

Berpengaruh pada:

```text
signing value
sponsor interest
team reputation
```

---

# 66. JOKI HISTORY

Catatan:

```text
Races
Wins
Podiums
Championships
```

---

# 67. JOKI RETIREMENT

Joki veteran dapat:

```text
RETIRE
```

History tetap ada.

---

# 68. RACING SYSTEM

Dua dunia:

```text
LIAR
RESMI
```

---

# 69. LIAR

Liar adalah quick-play event.

Contoh:

```text
Night Sprint
High Stake
Heads-Up
```

---

# 70. LIAR CHARACTER

```text
quick
flexible
higher variance
```

Tidak ada championship panjang.

---

# 71. OFFICIAL

Official:

```text
class
race calendar
points
championship
```

---

# 72. OFFICIAL CLASSES

Awal:

```text
STREET
PRO
OPEN
```

---

# 73. RACE ELIGIBILITY

Motor hanya dapat ikut class yang sesuai Build Score.

---

# 74. RACE TYPES

```text
SHORT
MEDIUM
LONG
TECHNICAL
```

---

# 75. TRACK EFFECTS

Short:

```text
Acceleration
```

Long:

```text
Power
```

Technical:

```text
Grip
Shift
```

Medium:

```text
Balanced
```

---

# 76. TRACK CONDITIONS

```text
DRY
WET
NIGHT
```

---

# 77. PRE-RACE MANAGEMENT

Player memilih:

```text
Motor
Joki
Risk
```

---

# 78. RISK MODE

```text
SAFE
NORMAL
PUSH
```

---

# 79. SAFE

```text
easier minigame
lower maximum performance
lower wear
```

---

# 80. NORMAL

Balanced.

---

# 81. PUSH

```text
harder minigame
higher performance
higher wear
```

---

# 82. RACING MINIGAME

Core:

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

# 83. LAUNCH

Timing:

```text
PERFECT
GOOD
LATE
MISS
```

---

# 84. SHIFT

RPM bar:

```text
LOW
──────
OPTIMAL
──────
REDLINE
```

Player melakukan shift.

---

# 85. PLAYER SKILL

Player timing memengaruhi race.

---

# 86. MOTOR SKILL

Motor menentukan baseline.

---

# 87. JOKI SKILL

Joki menentukan:

```text
launch window
shift window
variance
```

---

# 88. RACE RESULT

```text
1ST
2ND
3RD
...
DNF
```

Reward:

```text
money
reputation
points
history
joki experience
```

---

# 89. MOTOR WEAR

Race mengurangi condition.

Tidak mengurangi:

```text
energy player
```

---

# 90. BREAKDOWN

Hanya mungkin ketika:

```text
low reliability
+
push
```

Efek:

```text
penalty
atau
DNF
```

Jarang.

---

# 91. CHAMPIONSHIP

Official season:

```text
8 races
```

---

# 92. POINTS

Contoh:

```text
1st 25
2nd 18
3rd 15
4th 12
5th 10
```

---

# 93. SEASON PERSISTENCE

Tetap:

```text
garage
money
motor
joki
reputation
history
```

Reset:

```text
championship points
```

---

# 94. AI RIVALS

Rival sederhana:

```text
Name
Garage
Class
Performance
Consistency
Preferred Track
```

---

# 95. RIVAL ARCHETYPES

```text
POWER TEAM
CONSISTENCY TEAM
BUDGET TEAM
STAR TEAM
```

---

# 96. RIVAL DEVELOPMENT

Season berikutnya rival dapat berkembang.

```text
better motor
better joki
better build
```

Tidak perlu full AI simulation.

---

# 97. SPONSOR

Sponsor adalah objective-based bonus system.

---

# 98. SPONSOR TYPES

```text
PART
OIL
GARAGE
RACING
LOCAL BUSINESS
```

---

# 99. SPONSOR OBJECTIVES

```text
WIN
TOP 3
COMPLETE BUILDS
SELL MOTOR
```

---

# 100. SPONSOR REWARDS

```text
Money
Parts
Discount
Reputation
Cosmetic
```

---

# 101. REPUTATION

Satu angka:

```text
0–100
```

---

# 102. REPUTATION SOURCES

```text
Customer Satisfaction
Race Results
Motor Sales
Build Quality
Championship
```

---

# 103. REPUTATION TIERS

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

# 104. REPUTATION UNLOCKS

```text
Better Customer
Better Market
Better Joki
Better Race
Better Sponsor
```

---

# 105. GARAGE PROGRESSION

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

---

# 106. GARAGE CAPACITY

Level menentukan:

```text
Motor Slots
Order Slots
Mechanic Slots
Joki Slots
```

---

# 107. GARAGE VISUAL PROGRESSION

Level 1:

```text
Workbench
Toolbox
1–2 Motor
```

Level 3:

```text
Lift
Parts Rack
Multiple Bikes
```

Level 5:

```text
Showroom
Trophy Wall
Race Display
Sponsor Signs
```

---

# 108. GARAGE COSMETICS

Preset:

```text
CLASSIC
RACING
INDUSTRIAL
NIGHT
CLEAN
```

Cosmetic tidak memengaruhi balance.

---

# 109. HALL OF FAME

Garage level tinggi dapat memiliki:

```text
Legendary Motors
Champion Drivers
Championships
Records
```

---

# 110. PLAYER CAREER

Player tidak memiliki level.

Yang berkembang:

```text
Garage
Reputation
History
Mastery
```

---

# 111. MASTERY SYSTEM

Empat mastery sederhana:

```text
BUILDER
TRADER
WORKSHOP
RACER
```

---

# 112. BUILDER MASTERY

Berdasarkan:

```text
Builds Completed
Build Quality
```

---

# 113. TRADER MASTERY

Berdasarkan:

```text
Motors Sold
Profit
```

---

# 114. WORKSHOP MASTERY

Berdasarkan:

```text
Customer Orders
Satisfaction
```

---

# 115. RACER MASTERY

Berdasarkan:

```text
Wins
Championship
Records
```

---

# 116. MASTERY BUKAN POWER

Mastery adalah:

```text
career record
identity
achievement
```

Bukan:

```text
+500 damage
```

---

# 117. PLAYER IDENTITY

Game dapat secara otomatis menampilkan:

```text
PROJECT BUILDER
```

atau:

```text
RACE GARAGE
```

atau:

```text
MOTOR DEALER
```

berdasarkan history.

Tidak mengunci player.

---

# 118. ECONOMY

Satu currency:

# UANG

---

# 119. MONEY SOURCES

```text
Customer
Motor Sale
Race
Sponsor
```

---

# 120. MONEY SINKS

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

# 121. PROFIT DISPLAY

Setiap business transaction menampilkan:

```text
Revenue
Cost
Profit
```

Player selalu memahami apakah keputusan bisnisnya berhasil.

---

# 122. BUSINESS STRATEGIES

## SERVICE GARAGE

Pendapatan aman.

## DEALER

Beli murah, jual mahal.

## BUILDER

Build project, sell high.

## RACE GARAGE

Race + sponsor.

## HYBRID

Kombinasi.

---

# 123. CUSTOMER VS PROJECT

Player sering menghadapi pilihan:

```text
CUSTOMER
Guaranteed profit

PROJECT
Potentially larger profit
```

---

# 124. PROJECT VS RACE

```text
SELL
Immediate income

RACE
Potentially more income
+
reputation
```

---

# 125. MOTOR VS JOKI

Budget terbatas.

Pilih:

```text
better motor
```

atau:

```text
better joki
```

---

# 126. POWER VS RELIABILITY

```text
Power ↑
Reliability ↓
```

atau sebaliknya.

---

# 127. CLASS VS PERFORMANCE

Motor lebih kuat dapat masuk kompetisi lebih sulit.

Jangan selalu upgrade.

---

# 128. ENDGAME DESIGN

Endgame tidak menggunakan:

```text
level 100
```

atau:

```text
money max
```

---

# 129. ENDGAME GOALS

Pemain dapat mengejar:

```text
Championships
Race Records
Motor Collection
Legendary Builds
Garage Reputation
Joki Legacy
Profit Records
Customer Mastery
Build Mastery
```

---

# 130. PERSONAL RECORDS

```text
Best Race Time
Best Sale
Biggest Profit
Most Expensive Build
Most Wins
```

---

# 131. BUILD CHALLENGES

Constraint-based gameplay.

Contoh:

```text
Build Score ≥ 75
Budget ≤ 8M
```

---

# 132. SPECIAL CHALLENGES

```text
SALVAGE ONLY
```

```text
UNDER BUDGET
```

```text
STREET ONLY
```

```text
LOW COST
```

```text
RELIABILITY BUILD
```

---

# 133. WHY CHALLENGES MATTER

Challenge mengubah:

```text
old motors
old parts
old garages
```

menjadi relevan kembali.

---

# 134. DAILY OPPORTUNITY

Bukan daily reward.

Yang muncul adalah:

```text
New Project
New Customer
New Race
New Sponsor
```

Daily content adalah opportunity.

Bukan FOMO.

---

# 135. WEEKLY CONTENT

Rotasi:

```text
PROJECT WEEK
STREET WEEK
CLASSIC WEEK
BUDGET WEEK
RACE WEEK
```

Hanya parameter berubah.

---

# 136. EVENT GENERATION

Event dibuat dari template.

Contoh:

```text
Budget
Class
Track
Target
Reward
```

Sehingga satu sistem bisa menghasilkan banyak scenario.

---

# 137. NO LIVE-OPS DEPENDENCY

Game tidak membutuhkan admin setiap minggu.

Rotation dapat ditentukan otomatis.

---

# 138. LEGACY SYSTEM

Simpan:

```text
Garage Age
Championships
Historic Motors
Historic Joki
Major Sales
Major Builds
```

---

# 139. GARAGE AGE

Contoh:

```text
Season 1
Season 5
Season 10
Season 20
```

Semakin lama:

> sejarah semakin panjang.

---

# 140. MOTOR LEGACY

Motor dapat menjadi:

```text
Legendary Motor
```

berdasarkan:

```text
Wins
Championship
History
```

---

# 141. JOKI LEGACY

Joki dapat menjadi:

```text
Legendary Driver
```

---

# 142. GARAGE LEGACY

Garage sendiri dapat mencapai:

# LEGENDARY

---

# 143. ENDGAME HALL

Halaman:

# GARAGE LEGACY

Menampilkan:

```text
CAREER
WORKSHOP
RACING
COLLECTION
RECORDS
LEGENDS
```

---

# 144. THE LEGACY SCREEN

Contoh:

```text
BENGKEL MALAM

Founded:
Season 1

Garage:
Level 5

Reputation:
96

Championships:
7

Race Wins:
83

Customer Builds:
438

Motor Sold:
196

Best Sale:
Rp 42M

Best Race:
8.217s
```

---

# 145. RETENTION PHILOSOPHY

Retention berasal dari empat motivasi:

```text
PROGRESS
DISCOVERY
MASTERY
OWNERSHIP
```

---

# 146. PROGRESS

```text
Garage grows
```

---

# 147. DISCOVERY

```text
new project
new joki
new market
new build idea
```

---

# 148. MASTERY

```text
better builds
better race
better profit
```

---

# 149. OWNERSHIP

```text
my garage
my motor
my joki
my history
```

---

# 150. DISCOVERY IS THE MOST IMPORTANT FOR RETURNING PLAYERS

Player veteran tetap membuka game karena:

> “Project apa yang muncul sekarang?”

Bukan:

> “Saya harus collect daily coins.”

---

# 151. NO FOMO RETENTION

Tidak memakai:

```text
login streak
energy
daily punishment
artificial cooldown
```

---

# 152. PLAYER TIME RESPECT

Game boleh dimainkan:

```text
5 minutes
```

dan tetap meaningful.

---

# 153. SESSION LOOP

```text
Check
↓
Choose
↓
Act
↓
Outcome
↓
Improve
```

---

# 154. 5-MINUTE SESSION

```text
Check market
Buy part
Repair motor
```

---

# 155. 15-MINUTE SESSION

```text
Finish customer
Build motor
Race
```

---

# 156. 30-MINUTE SESSION

```text
Find project
Restore
Build
Race
Sell
```

---

# 157. 1-HOUR SESSION

```text
Manage customer
Build project
Recruit driver
Race championship
Upgrade garage
```

---

# 158. VETERAN SESSION

```text
Test build
Try challenge
Beat record
Scout rookie
```

---

# 159. WHY OLD CONTENT NEVER DIES

Setiap object dapat dipakai kembali.

Motor:

```text
Race
Sell
Challenge
Collection
History
```

Part:

```text
Build
Customer
Sale
Challenge
```

Joki:

```text
Race
Challenge
Legacy
```

---

# 160. GAME CONTENT REUSE

Sistem tidak perlu terus-menerus membuat feature baru.

Kita cukup membuat:

```text
new motor
new part
new joki
new customer template
new race template
```

---

# 161. CONTENT SCALE

Target v1.0:

```text
15–20 Motor
60+ Parts
10–12 Joki
30 Customer Templates
20 Liar Events
20 Official Events
3 Classes
8 Tracks
15 Sponsors
```

---

# 162. MVP

MVP:

```text
3 Motor
12 Components
10 Parts
2 Joki
5 Customer Orders
3 Salvage
3 Liar Events
3 Official Events
1 Class
1 Sponsor
1 Garage Upgrade
```

---

# 163. LOCAL SAVE

Local game menyimpan:

```text
Player
Garage
Money
Motors
Parts
Joki
Customer Progress
Race History
Sponsor
Legacy
```

---

# 164. LOCAL DATA MODEL

Mental model:

```text
PLAYER
│
├── GARAGE
│
├── MOTORS
│
├── PARTS
│
├── JOKI
│
├── CUSTOMER ORDERS
│
├── SPONSORS
│
└── HISTORY
```

---

# 165. DATABASE TABLES

MVP:

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
history
```

---

# 166. NO NEED FOR 50 TABLES

Semakin sedikit entity:

```text
lebih mudah
lebih mudah debugging
lebih mudah balancing
lebih mudah migration
```

---

# 167. SIMPLE ASTRO ARCHITECTURE

```text
PAGES
  ↓
COMPONENTS
  ↓
GAME LOGIC
  ↓
LOCAL DATABASE
```

---

# 168. ASTRO PAGES

Core:

```text
/
 /garage
 /motor
 /workshop
 /market
 /team
 /race
 /profile
```

---

# 169. MOTOR DETAIL

```text
/motor/[id]
```

---

# 170. RACE DETAIL

```text
/race/[id]
```

---

# 171. COMPONENT GROUPS

```text
components/
├── ui/
├── garage/
├── motor/
├── workshop/
├── market/
├── team/
└── race/
```

---

# 172. GAME LOGIC

```text
lib/game/
├── motor.ts
├── build.ts
├── workshop.ts
├── market.ts
├── driver.ts
├── race.ts
├── sponsor.ts
└── progression.ts
```

---

# 173. DATA

```text
lib/data/
├── motors.ts
├── parts.ts
├── drivers.ts
├── customers.ts
├── races.ts
└── sponsors.ts
```

---

# 174. SERVER

Pada local-first:

```text
lib/server/
├── auth.ts
├── player.ts
└── save.ts
```

Server rendering dapat digunakan bila deployment membutuhkan persistence server.

---

# 175. CLIENT INTERACTION

JavaScript hanya digunakan ketika diperlukan:

```text
tabs
modal
build interaction
race minigame
filters
```

---

# 176. RACE MINIGAME CLIENT

Race minigame dapat dijalankan client.

Tetapi result tetap dapat dihitung menggunakan deterministic formula.

---

# 177. LOCAL GAME AUTHORITY

Dalam local-first, source of truth:

```text
local save
```

Nanti ketika online:

```text
server
```

menjadi source of truth.

---

# 178. OFFLINE SUPPORT

Game sebaiknya tetap dapat dimainkan dalam kondisi internet buruk untuk local gameplay tertentu.

---

# 179. ONLINE MIGRATION FUTURE

Data model:

```text
player_id
motor_id
driver_id
race_id
```

sudah dibuat stabil sejak awal.

Ketika online:

```text
LOCAL DATA
↓
SYNC
↓
SERVER
```

---

# 180. FUTURE PVP

PVP ditambahkan sebagai layer:

```text
same Motor Entity
same Driver Entity
same Race Rules
```

Sehingga tidak perlu membuat sistem balap kedua.

---

# 181. FUTURE PLAYER MARKET

Player-to-player sales akan menggunakan:

```text
existing Motor Entity
```

bukan motor entity baru.

---

# 182. FUTURE ASYNC RACE

Player record disimpan:

```text
race time
motor
driver
build
```

Player lain bisa melawan record.

---

# 183. FUTURE GARAGE SHOWCASE

Garage dapat dipublikasikan.

Tetapi data tetap berasal dari:

```text
existing Garage Entity
```

---

# 184. NO ARCHITECTURE REWRITE

Inilah alasan local-first sangat bagus.

Core game:

```text
Motor
Build
Race
Business
```

tidak perlu diubah ketika multiplayer datang.

Yang berubah hanya:

```text
persistence
network
identity
sync
```

---

# 185. VISUAL DESIGN

Game harus full pixel.

---

# 186. PIXEL ART APPROACH

Gunakan:

```text
CSS
HTML
Inline SVG
Pixel sprites
Sprite sheets
```

---

# 187. NO DESIGN EXPERIENCE REQUIRED

Semua visual akan berasal dari:

```text
Design System
Components
Tokens
Layouts
```

bukan dari kemampuan manual design kamu.

---

# 188. PIXEL GRID

Gunakan:

```text
4px
8px
12px
16px
24px
32px
```

---

# 189. BORDER

```text
0–4px
```

Hard pixel corners.

---

# 190. SHADOW

```text
4px 4px 0
```

Hard shadow.

---

# 191. COLORS

Core palette:

```text
ASPHALT
METAL
CREAM
RUST
RED
ORANGE
YELLOW
GREEN
```

---

# 192. TYPOGRAPHY

Display:

```text
Pixel / Arcade
```

Data:

```text
Monospace
```

---

# 193. GARAGE VISUAL

```text
concrete
toolbox
motor stand
oil
sticker
parts
trophy
neon
```

---

# 194. PIXEL MOTOR VISUAL

Motor sprite harus dapat berubah berdasarkan:

```text
model
condition
build state
```

---

# 195. MOTOR VISUAL STATES

```text
STOCK
DAMAGED
RESTORED
BUILT
```

---

# 196. GARAGE VISUAL STATES

```text
LEVEL 1
LEVEL 2
LEVEL 3
LEVEL 4
LEVEL 5
```

---

# 197. UI COMPONENTS

Core component kit:

```text
PixelPanel
PixelWindow
PixelCard
PixelButton
PixelBadge
PixelStat
PixelBar
PixelModal
PixelTab
PixelToast
PixelSprite
```

---

# 198. MAIN NAVIGATION

Mobile:

```text
GARAGE
MOTOR
WORKSHOP
MARKET
TEAM
RACE
```

Desktop:

```text
Sidebar
```

---

# 199. HOME GARAGE

Dashboard menampilkan:

```text
Cash
Reputation
Garage Level
Active Orders
Motor Alerts
Next Race
Current Challenge
```

---

# 200. CURRENT ASPIRATION

Selalu ada satu:

# NEXT ASPIRATION

Contoh:

```text
Win Street Championship
```

atau:

```text
Finish Garuda Project
```

atau:

```text
Beat Personal Best
```

---

# 201. CURRENT GOALS

Maksimal:

```text
3
```

Contoh:

```text
□ Finish customer build
□ Find project
□ Win tonight race
```

---

# 202. GOAL SYSTEM BUKAN QUEST SYSTEM

Goal adalah:

```text
direction
```

Bukan:

```text
mandatory storyline
```

---

# 203. EVENT FEED

Dashboard menunjukkan:

```text
New salvage arrived.
Customer build completed.
Official Street Round available.
```

---

# 204. MARKET SCREEN

Tiga tab:

```text
MOTOR
PARTS
RONGSOKAN
```

---

# 205. MOTOR SCREEN

```text
OWNED
PROJECT
FAVORITES
RETIRED
```

---

# 206. WORKSHOP SCREEN

```text
CUSTOMERS
REPAIRS
BUILDS
MECHANICS
```

---

# 207. TEAM SCREEN

```text
ACTIVE JOKI
AVAILABLE JOKI
HISTORY
```

---

# 208. RACE SCREEN

```text
LIAR
RESMI
CHAMPIONSHIP
RECORDS
```

---

# 209. PROFILE

```text
CAREER
GARAGE
RACING
WORKSHOP
COLLECTION
LEGACY
```

---

# 210. RETENTION ARCHITECTURE

Game mempunyai:

```text
SHORT LOOP
```

```text
MID LOOP
```

```text
LONG LOOP
```

---

# 211. SHORT LOOP

```text
Buy
Repair
Build
Race
Sell
```

---

# 212. MID LOOP

```text
Garage Upgrade
Joki
Customer
Sponsor
Championship
```

---

# 213. LONG LOOP

```text
Mastery
Collection
Records
Legacy
```

---

# 214. SHORT-TERM SATISFACTION

```text
money
win
build completed
sale profit
```

---

# 215. MID-TERM SATISFACTION

```text
garage level
joki development
championship
reputation
```

---

# 216. LONG-TERM SATISFACTION

```text
legendary motor
record
collection
legacy
```

---

# 217. ENDGAME RETENTION

Endgame pemain memiliki empat pilihan besar:

```text
MASTER
COLLECT
COMPETE
CREATE
```

---

# 218. MASTER

Menjadi builder terbaik.

---

# 219. COLLECT

Mencari motor unik.

---

# 220. COMPETE

Mengejar championship dan records.

---

# 221. CREATE

Membangun garage dengan identitas.

---

# 222. MASTER BUILDS

Constraint:

```text
Budget
Class
Reliability
Parts
```

---

# 223. COLLECTOR BUILDS

Cari:

```text
rare model
rare frame
rare project
historic motor
```

---

# 224. COMPETITOR BUILDS

Optimalkan:

```text
Track
Class
Driver
Timing
```

---

# 225. CREATE BUILDS

Build sesuai selera.

Contoh:

```text
Maximum acceleration
```

walaupun kurang profitable.

---

# 226. “WEALTH DOES NOT SOLVE EVERYTHING”

Ketika player kaya:

Money dapat membeli:

```text
parts
motors
garage
drivers
```

Tetapi tidak langsung membeli:

```text
track record
history
mastery
legend
personal best
```

---

# 227. MONEY SINK FOR RICH PLAYERS

Setelah kaya:

```text
rare projects
collection
premium builds
garage cosmetics
high-profile drivers
```

Tetapi money sink bukan keharusan.

---

# 228. NON-MONETARY ENDGAME

Lebih penting:

```text
records
titles
history
mastery
collection
legacy
```

---

# 229. PLAYER NEVER HAS “NOTHING TO DO”

Dalam keadaan apapun, game harus dapat menawarkan salah satu:

```text
Motor
Customer
Market
Race
Challenge
Joki
Build
Collection
Record
```

---

# 230. EMPTY STATE DESIGN

Kalau tidak ada customer:

> **MARKET OPPORTUNITY AVAILABLE**

Kalau tidak ada race:

> **BUILD CHALLENGE AVAILABLE**

Kalau tidak ada project:

> **CHECK PART MARKET**

Tidak boleh hanya:

> “Tidak ada aktivitas.”

---

# 231. CONTENT FALLBACK

Setiap sistem mempunyai fallback action.

```text
NO CUSTOMER
→ MARKET

NO RACE
→ BUILD CHALLENGE

NO PROJECT
→ PART BUILD

NO MONEY
→ SERVICE

NO NEED FOR UPGRADE
→ RECORD / COLLECTION
```

---

# 232. THIS PREVENTS DEAD ENDS

Pemain tidak masuk kondisi:

> “Tidak ada yang bisa dilakukan.”

---

# 233. ZERO ENERGY EXPERIENCE

Setelah race:

```text
player can still:
sell
buy
build
customer
market
team
```

Tidak ada recovery screen.

---

# 234. ZERO COOLDOWN EXPERIENCE

Setelah build:

```text
motor finished
```

Player dapat langsung memutuskan:

```text
race
sell
display
```

---

# 235. ZERO WAITING EXPERIENCE

Game selalu memberi:

```text
decision
```

bukan:

```text
timer
```

---

# 236. PLAYER AGENCY

Pemain bebas:

```text
racer
dealer
builder
workshop
hybrid
```

---

# 237. NO PERMANENT CLASS

Tidak ada class player.

---

# 238. NO META BUILD

Tidak ada motor universal terbaik.

---

# 239. NO META JOKI

Tidak ada joki universal terbaik.

---

# 240. NO META MONEY METHOD

Tidak ada income source yang selalu optimal.

---

# 241. ECONOMIC BALANCE

Ideal:

```text
safe = predictable
risky = volatile
skill = higher ceiling
knowledge = better margin
```

---

# 242. BUILD BALANCE

```text
power
vs
reliability
```

---

# 243. BUSINESS BALANCE

```text
customer
vs
project
vs
race
```

---

# 244. TEAM BALANCE

```text
cheap rookie
vs
expensive star
```

---

# 245. CLASS BALANCE

```text
Street
→ accessible

Pro
→ competitive

Open
→ aspirational
```

---

# 246. RACING BALANCE

Player skill harus berarti.

Tetapi build dan joki juga berarti.

---

# 247. RACE FORMULA

Conceptual:

```text
Base Time
- Motor Performance
- Driver Performance
- Launch Performance
- Shift Performance
+ Track Modifier
+ Condition Modifier
+ Small Variance
```

---

# 248. MARKET FORMULA

```text
Value =
Base Value
× Condition
× Build Quality
× Parts
× History
× Market Modifier
```

---

# 249. CUSTOMER FORMULA

```text
Satisfaction =
Target
+
Quality
+
Cost Efficiency
+
Timeliness
```

---

# 250. GARAGE PROGRESSION FORMULA

```text
Money
+
Reputation
=
Garage Unlocks
```

---

# 251. HISTORY SYSTEM

Simpan major milestones:

```text
First Motor
First Build
First Sale
First Race
First Win
First Customer
First Sponsor
First Championship
```

---

# 252. HISTORY IS NOT JUST A LOG

History digunakan untuk:

```text
Profile
Motor Legacy
Garage Legacy
Joki Legacy
```

---

# 253. PROFILE STORY

Profile harus terasa seperti:

> **rekam jejak sebuah bengkel.**

---

# 254. MOTOR STORY

Motor history:

> **rekam jejak sebuah motor.**

---

# 255. JOKI STORY

Joki history:

> **rekam jejak seorang pembalap.**

---

# 256. SEASON STORY

Season:

> **rekam jejak satu periode karier.**

---

# 257. GAME WORLD STORY

Tidak ada global persistent simulation kompleks.

Sejarah hanya berasal dari:

```text
player career
races
motors
garage
```

Ini cukup.

---

# 258. WHY THIS IS BETTER THAN MMO SIMULATION

Kita mendapatkan:

```text
sense of history
```

tanpa harus menjalankan:

```text
world simulation
```

---

# 259. NO NPC SOCIETY

Customer adalah data.

Joki adalah data + identity.

Rival adalah data.

Tidak ada NPC civilization.

---

# 260. NO FACTION

Tidak diperlukan.

---

# 261. NO TERRITORY

Tidak diperlukan.

---

# 262. NO OPEN WORLD

Tidak diperlukan.

---

# 263. WORLD REPRESENTATION

Lokasi hanya context:

```text
Arum
Wates
Jaya
Sindur
Pantura
```

---

# 264. CITY CULTURE

Culture direpresentasikan melalui:

```text
name
visual
language
music
events
garage style
```

---

# 265. INDONESIAN CULTURE

Game tidak perlu memodelkan masyarakat Indonesia secara besar.

Cukup menghadirkan:

```text
bengkel
warung
spanduk
stiker
nama lokal
bahasa informal
motor culture
race culture
night atmosphere
```

---

# 266. LOCALIZED CONTENT

Contoh nama garage:

```text
Bengkel Malam
Wong Speed
Jaya Motor
Pakde Performance
Kampung Racing
Pantura Garage
```

---

# 267. MOTOR BRANDING

Fiktif:

```text
NUSA
JATRA
GARUDA
MERAPI
ARUNA
```

---

# 268. TRACKS

Fiktif:

```text
Arum Sprint
Wates Strip
Sindur Long Run
Pantura Night
Jaya Technical
```

---

# 269. VISUAL WORLD

Tidak perlu 3D.

Pixel-art environment.

---

# 270. UI STYLE

UI harus terlihat seperti:

```text
garage board
race sheet
parts catalog
workshop invoice
CRT display
```

---

# 271. ACCESSIBILITY

Pixel tidak boleh berarti sulit dibaca.

Tetap:

```text
high contrast
clear hierarchy
keyboard support
mobile support
large tap target
```

---

# 272. RESPONSIVE DESIGN

Mobile:

```text
bottom nav
stacked cards
compact stats
```

Desktop:

```text
sidebar
multi-column
large garage visual
```

---

# 273. NO DESIGNER DEPENDENCY

Design system menyimpan:

```text
spacing
colors
typography
borders
shadows
components
```

---

# 274. DEVELOPMENT PHILOSOPHY

Bangun **vertical slice**, bukan seluruh sistem sekaligus.

---

# 275. VERTICAL SLICE 1

```text
Garage
→ Buy Motor
→ Buy Part
→ Build
→ Race
→ Earn
→ Sell
```

---

# 276. VERTICAL SLICE 2

Tambahkan:

```text
Customer
→ Build
→ Payment
```

---

# 277. VERTICAL SLICE 3

Tambahkan:

```text
Joki
→ Assign
→ Race
```

---

# 278. VERTICAL SLICE 4

Tambahkan:

```text
Rongsokan
→ Restoration
→ Sell
```

---

# 279. VERTICAL SLICE 5

Tambahkan:

```text
Official
→ Class
→ Championship
```

---

# 280. VERTICAL SLICE 6

Tambahkan:

```text
Sponsor
→ Objective
→ Reward
```

---

# 281. VERTICAL SLICE 7

Tambahkan:

```text
Legacy
→ History
→ Records
```

---

# 282. FINAL MVP FLOW

```text
START
 ↓
GET GARAGE
 ↓
GET MOTOR
 ↓
BUY PART
 ↓
BUILD MOTOR
 ↓
RACE
 ↓
EARN
 ↓
SELL / REBUILD
 ↓
CUSTOMER
 ↓
JOKI
 ↓
OFFICIAL
```

---

# 283. V1.0 FLOW

```text
GARAGE
├── MOTOR
│   ├── STOCK
│   ├── USED
│   ├── PROJECT
│   └── BUILDS
│
├── WORKSHOP
│   ├── SERVICE
│   ├── REPAIR
│   ├── RESTORATION
│   └── CUSTOMER BUILDS
│
├── MARKET
│   ├── MOTOR
│   ├── PARTS
│   └── RONGSOKAN
│
├── TEAM
│   └── JOKI
│
├── RACE
│   ├── LIAR
│   └── RESMI
│
└── LEGACY
```

---

# 284. MASTER GAME ECONOMY

```text
                  MOTOR
                    │
          ┌─────────┼─────────┐
          ↓         ↓         ↓
       REPAIR     BUILD      SELL
          │         │         │
          └────┬────┘         │
               ↓              │
            CUSTOMER          │
               │              │
               ↓              │
             MONEY ←──────────┘
               │
          ┌────┴────┐
          ↓         ↓
         JOKI      GARAGE
          │         │
          └────┬────┘
               ↓
              RACE
               │
       ┌───────┴────────┐
       ↓                ↓
      LIAR             RESMI
                         │
                    CHAMPIONSHIP
                         │
                      REPUTATION
                         │
                        MARKET
```

---

# 285. MASTER PLAYER EXPERIENCE

```text
DISCOVER
→
DECIDE
→
BUILD
→
TEST
→
PROFIT
→
PROGRESS
→
MASTER
```

---

# 286. DISCOVER

```text
project
motor
part
joki
customer
race
```

---

# 287. DECIDE

```text
buy
repair
build
sell
race
```

---

# 288. BUILD

```text
motor
garage
team
business
```

---

# 289. TEST

```text
race
customer
market
```

---

# 290. PROFIT

```text
money
reputation
experience
```

---

# 291. PROGRESS

```text
garage
joki
collection
championship
```

---

# 292. MASTER

```text
records
challenge
legacy
```

---

# 293. THE ANTI-BOREDOM ENGINE

Boredom prevention bukan feature tunggal.

Ia terdiri dari:

```text
VARIETY
+
TRADE-OFF
+
DISCOVERY
+
MASTERY
+
OWNERSHIP
```

---

# 294. VARIETY

```text
different motors
different customers
different races
different joki
```

---

# 295. TRADE-OFF

```text
power vs reliability
buy vs save
sell vs race
customer vs project
```

---

# 296. DISCOVERY

```text
rare project
new joki
new sponsor
new challenge
```

---

# 297. MASTERY

```text
better build
better time
better margin
```

---

# 298. OWNERSHIP

```text
garage
motor
history
legacy
```

---

# 299. FINAL RETENTION LADDER

```text
SESSION 1
“I want more money.”

SESSION 5
“I want a better motor.”

SESSION 10
“I want my garage upgraded.”

SESSION 20
“I want better joki.”

SESSION 30
“I want the championship.”

SESSION 50
“I want a legendary build.”

SESSION 100
“I want the record.”

LATE GAME
“I want my garage to have a history.”
```

---

# 300. WHAT KEEPS A RICH PLAYER PLAYING?

Bukan:

```text
more money
```

Tetapi:

```text
more mastery
more discovery
more records
more collection
more challenges
more history
```

---

# 301. RICH PLAYER ACTIVITY

Saat uang berlebih:

```text
hunt rare project
build experimental motor
train rookie
attempt challenge
chase record
complete collection
retire legendary motor
upgrade cosmetics
```

---

# 302. NO ARTIFICIAL DIFFICULTY

Jangan sengaja:

```text
inflate prices endlessly
```

atau:

```text
slow progression artificially
```

Untuk menahan pemain.

---

# 303. DIFFICULTY COMES FROM CHOICE

```text
budget
class
build
driver
race
```

---

# 304. ENDGAME CHALLENGE EXAMPLES

### SALVAGE MASTER

```text
Use salvage motor.
Budget ≤ 10M.
Win official.
```

### BUDGET BUILDER

```text
Build Score ≥ 75.
Build Cost ≤ 6M.
```

### DRIVER DEVELOPER

```text
Rookie Driver
→
3 Wins
```

### RECORD HUNTER

```text
Beat Personal Best.
```

### DEALER MASTER

```text
10 profitable flips.
```

---

# 305. CHALLENGE REWARDS

Bukan selalu uang.

Bisa:

```text
Title
Badge
Cosmetic
History
Prestige
```

---

# 306. PRESTIGE

Bukan currency.

Hanya record:

```text
First Championship
10 Championships
50 Wins
100 Builds
```

---

# 307. TITLE

Contoh:

```text
SALVAGE MASTER
MASTER BUILDER
RACE VETERAN
GARAGE LEGEND
TOP DEALER
```

---

# 308. TITLE PURPOSE

Memberi identitas.

Bukan combat power.

---

# 309. GARAGE SHOWCASE LOCAL

Bahkan tanpa multiplayer, player dapat melihat:

```text
Garage
Favorite Motor
Favorite Driver
Trophies
Records
```

Ini menjadi personal museum.

---

# 310. FUTURE ONLINE SHOWCASE

Data yang sama nanti dapat dipublish.

---

# 311. CONTENT PIPELINE

Developer dapat menambah konten tanpa mengubah engine.

Motor:

```text
data
```

Part:

```text
data
```

Race:

```text
data
```

Customer:

```text
data
```

Sponsor:

```text
data
```

---

# 312. THIS IS WHY THE GAME IS EASY TO EXPAND

Core code tetap.

Konten bertambah.

---

# 313. TESTING PRIORITY

Unit tests:

```text
Motor Value
Build Score
Race Result
Customer Profit
Transactions
Class Eligibility
Garage Capacity
```

---

# 314. BALANCING PRIORITY

Pastikan:

```text
No infinite strategy.
No obvious best motor.
No obvious best joki.
No obvious best income.
```

---

# 315. SECURITY PRIORITY

Walaupun local-first:

Game state mutation tetap dipusatkan dalam game logic.

Kelak saat online:

```text
same logic
```

dapat dipindah ke server.

---

# 316. PERSISTENCE

MVP dapat menyimpan state secara lokal.

Production version dapat memakai local database/browser storage sesuai kebutuhan.

---

# 317. ONLINE TRANSITION

Saat nanti ingin online:

```text
LOCAL SAVE
↓
ACCOUNT
↓
SYNC
↓
SERVER SAVE
```

Core content tetap sama.

---

# 318. FINAL TECH STACK

Target:

```text
Astro
TypeScript
Drizzle
SQLite-compatible local persistence for local-first development
CSS
SVG
Vanilla JS
```

Server/database deployment dapat disesuaikan kemudian.

---

# 319. WHY ASTRO

Astro cocok untuk:

```text
UI-heavy pages
component architecture
server rendering
small client islands/scripts
```

Game tidak harus menjadi SPA penuh.

---

# 320. FINAL PROJECT PHILOSOPHY

```text
Simple Architecture
+
Deep Interaction
+
Data-driven Content
=
BENGKEL MALAM
```

---

# 321. FINAL SIX CORE SYSTEMS

Seluruh game bisa direduksi ke:

```text
1. GARAGE
2. MOTOR
3. WORKSHOP
4. MARKET
5. TEAM
6. RACE
```

Sisanya hanyalah fungsi atau data yang memperkuat keenam sistem ini.

---

# 322. FINAL SYSTEM GRAPH

```text
                         GARAGE
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
        MOTOR           WORKSHOP           TEAM
          │                │                │
      ┌───┼───┐        CUSTOMER           JOKI
      ↓   ↓   ↓            │                │
    BUY BUILD SELL         BUILD            RACE
      │   │   │            │                │
      └───┼───┴────────────┴────────┬───────┘
          ↓                         ↓
        MARKET                    RACE
          │                  ┌─────┴─────┐
          │                  ↓           ↓
          │                LIAR         RESMI
          │                              │
          └──────────────┬───────────────┘
                         ↓
                       MONEY
                         ↓
                       GARAGE
```

---

# 323. ABSOLUTE FEATURE PRIORITY

Jika development tersendat, prioritaskan:

```text
1. MOTOR
2. BUILD
3. RACE
4. ECONOMY
5. WORKSHOP
6. JOKI
7. MARKET
8. CHAMPIONSHIP
9. SPONSOR
10. LEGACY
```

---

# 324. FEATURE FREEZE RULE

Sebelum menambahkan feature baru:

> **Bisakah kebutuhan ini diselesaikan dengan Motor, Workshop, Market, Team, atau Race?**

Jika iya:

> gunakan sistem yang sudah ada.

---

# 325. FEATURE BLOAT WARNING

Jangan tambahkan hanya karena terlihat “lebih seperti game”.

Contoh yang harus ditahan:

```text
energy
battle pass
guild
territory
open world
police
complex NPC
faction
housing
pet
crafting tree
```

---

# 326. QUALITY BAR

Fitur belum selesai hanya karena berfungsi.

Fitur harus memiliki:

```text
purpose
choice
trade-off
feedback
connection
```

---

# 327. MOTOR QUALITY TEST

Motor harus memiliki:

```text
purpose
condition
value
build potential
history
```

---

# 328. CUSTOMER QUALITY TEST

Customer harus memiliki:

```text
request
budget
choice
profit
satisfaction
```

---

# 329. RACE QUALITY TEST

Race harus memiliki:

```text
selection
preparation
execution
result
reward
```

---

# 330. JOKI QUALITY TEST

Joki harus memiliki:

```text
identity
strength
weakness
cost
progression
```

---

# 331. MARKET QUALITY TEST

Market harus memiliki:

```text
opportunity
price
condition
potential
```

---

# 332. GARAGE QUALITY TEST

Garage harus memiliki:

```text
capacity
progression
visual identity
business impact
```

---

# 333. THE PLAYER'S DAILY QUESTION

Setiap kali player masuk:

> **“Apa peluang terbaik saya sekarang?”**

Bukan:

> “Berapa energy saya?”

---

# 334. THE PLAYER'S LONG-TERM QUESTION

> **“Garage seperti apa yang ingin saya bangun?”**

---

# 335. THE ENDGAME QUESTION

> **“Apa yang akan menjadi bagian dari sejarah garage saya?”**

---

# 336. FINAL PLAYER JOURNEY

```text
UNKNOWN
↓
SMALL GARAGE
↓
WORKSHOP
↓
KNOWN BUILDER
↓
LOCAL RACE GARAGE
↓
ESTABLISHED GARAGE
↓
RENOWNED GARAGE
↓
LEGENDARY GARAGE
```

---

# 337. FINAL PLAYER STORY

```text
Beli motor bekas.
↓
Perbaiki.
↓
Bangun.
↓
Balap.
↓
Menang.
↓
Jual.
↓
Beli project lebih besar.
↓
Rekrut joki.
↓
Terima customer.
↓
Menang championship.
↓
Bangun legendary motor.
↓
Pensiunkan motor.
↓
Simpan di Hall of Fame.
```

---

# 338. FINAL GAME LOOP

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
                  TEST / RACE
                       ↓
                  SELL / KEEP
                       ↓
                     MONEY
                       ↓
                  GARAGE GROWTH
                       ↓
                    ACCESS
                       ↓
                  DISCOVER AGAIN
```

---

# 339. FINAL RETENTION LOOP

```text
DISCOVERY
↓
CURIOSITY
↓
CHOICE
↓
RESULT
↓
OWNERSHIP
↓
MASTERY
↓
NEW CHALLENGE
↓
DISCOVERY
```

---

# 340. FINAL BUSINESS LOOP

```text
CUSTOMER
↓
BUILD
↓
PROFIT
↓
REPUTATION
↓
BETTER CUSTOMER
↓
BETTER GARAGE
```

---

# 341. FINAL RACING LOOP

```text
BUILD
↓
JOKI
↓
RISK
↓
MINIGAME
↓
RESULT
↓
RECORD
↓
BETTER BUILD
```

---

# 342. FINAL TRADING LOOP

```text
MARKET
↓
FIND DEAL
↓
BUY
↓
REPAIR
↓
BUILD
↓
SELL
↓
PROFIT
```

---

# 343. FINAL LEGACY LOOP

```text
BUILD
↓
RACE
↓
WIN
↓
HISTORY
↓
RETIRE
↓
HALL OF FAME
↓
NEW BUILD
```

---

# 344. FINAL BENGKEL MALAM EXPERIENCE

Pemain bisa masuk selama 5 menit dan hanya:

```text
membeli project
```

Pemain lain bisa bermain 2 jam dan:

```text
menyelesaikan customer
build motor
mengatur joki
mengikuti race
menjual motor
mencari project baru
```

Keduanya tetap mendapatkan pengalaman yang valid.

---

# 345. FINAL GAME PROMISE

BENGKEL MALAM menjanjikan kepada pemain:

> **Kamu tidak perlu menunggu untuk bermain.**

> **Kamu tidak perlu menjadi pembalap untuk sukses.**

> **Kamu tidak perlu menjadi trader untuk kaya.**

> **Kamu tidak perlu membeli semua motor untuk memiliki garage hebat.**

> **Tetapi selalu ada sesuatu yang bisa dibangun, diuji, dijual, dibuktikan, atau diingat.**

---

# 346. FINAL MASTER PRINCIPLE

> **Pemain kembali karena penasaran dan punya tujuan, bukan karena sistem memaksa mereka kembali.**

---

# 347. FINAL DEFINITION

> **BENGKEL MALAM adalah pixel-art web-based garage management game tentang kultur otomotif Indonesia fiktif, di mana pemain membangun bisnis bengkel melalui jual-beli motor, restorasi motor rongsokan, service dan customer builds, pengelolaan part, perekrutan joki, serta balap liaran dan kompetisi resmi berbasis kelas. Semua gameplay utama berjalan lokal terlebih dahulu dengan persistent career, economy, motor history, joki history, records, challenges, collection, dan garage legacy. Fondasi lokal tersebut kemudian dapat diperluas menjadi async multiplayer, player marketplace, leaderboard, garage showcase, dan PvP tanpa mengubah core game loop.**

---

# 348. FINAL DESIGN SENTENCE

> **Bengkelmu adalah bisnis. Motor adalah proyek. Joki adalah orang yang membuktikannya. Balapan adalah ujian. Uang adalah alat. Dan sejarah adalah tujuan jangka panjang.**

---

# 349. FINAL 10 COMMANDMENTS

```text
01. BENGKEL adalah pusat game.

02. MOTOR adalah objek terpenting.

03. Tidak ada Energy.

04. Tidak ada Nerve.

05. Tidak ada gameplay waiting.

06. Setiap motor harus bisa memiliki lebih dari satu tujuan.

07. Racing harus membutuhkan management + player skill.

08. Business harus dapat sukses tanpa racing.

09. Endgame harus tetap berarti walaupun player kaya.

10. Fitur baru harus memperdalam sistem lama sebelum membuat sistem baru.
```

---

# 350. FINAL MASTER ARCHITECTURE

```text
                        BENGKEL MALAM
                              │
               ┌──────────────┼──────────────┐
               ↓              ↓              ↓
            GARAGE          MOTOR          BUSINESS
               │              │              │
               │         ┌────┼────┐     CUSTOMER
               │         ↓    ↓    ↓        │
               │       REPAIR BUILD SELL    │
               │         │    │    │        │
               │         └────┼────┘        │
               │              ↓             │
               │            MARKET           │
               │              │              │
               └──────────────┼──────────────┘
                              ↓
                            TEAM
                              │
                             JOKI
                              │
                              ↓
                            RACE
                       ┌──────┴──────┐
                       ↓             ↓
                     LIAR          RESMI
                                     │
                               CHAMPIONSHIP
                                     │
                                     ↓
                                REPUTATION
                                     │
                                     ↓
                                  LEGACY
```

---

# 351. THE FINAL GOAL

Pada akhirnya, BENGKEL MALAM bukan tentang:

> **“Saya sudah memiliki semua.”**

Tetapi:

> **“Saya sudah membangun sesuatu.”**

Dan ketika player sudah kaya, sudah punya semua akses, dan sudah menguasai game, masih tersisa:

```text
project yang belum dicoba
build yang belum dibuat
record yang belum dipecahkan
joki yang belum dikembangkan
collection yang belum lengkap
challenge yang belum selesai
history yang belum ditulis
```
```
Sehingga kekayaan bukan akhir permainan.

**Kekayaan membuka kebebasan.**

Dan kebebasan membuka:

> **mastery, eksperimen, collection, competition, dan legacy.**

Itulah bentuk BENGKEL MALAM yang saya sarankan kita bangun.

bengkel-malam/
│
├── public/
│   └── favicon.svg
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
│   │   ├── Layout.astro
│   │   ├── Header.astro
│   │   ├── Navigation.astro
│   │   ├── Card.astro
│   │   ├── Button.astro
│   │   ├── Modal.astro
│   │   ├── MotorCard.astro
│   │   ├── PartCard.astro
│   │   ├── DriverCard.astro
│   │   ├── OrderCard.astro
│   │   └── RaceCard.astro
│   │
│   ├── lib/
│   │   ├── game/
│   │   │   ├── motor.ts
│   │   │   ├── parts.ts
│   │   │   ├── workshop.ts
│   │   │   ├── market.ts
│   │   │   ├── team.ts
│   │   │   └── race.ts
│   │   │
│   │   ├── data/
│   │   │   ├── motors.ts
│   │   │   ├── parts.ts
│   │   │   ├── drivers.ts
│   │   │   ├── orders.ts
│   │   │   ├── races.ts
│   │   │   └── sponsors.ts
│   │   │
│   │   └── save.ts
│   │
│   └── styles/
│       └── global.css
│
├── package.json
├── astro.config.mjs
└── tsconfig.json
```
