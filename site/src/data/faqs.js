export const faqs = [
  {
    id:"1", category:"general", order:1,
    q:{ en:"What is YAMATO?", el:"Τι είναι το YAMATO;", ja:"YAMATOとは？" },
    a:{
      en:"YAMATO is Greece's first premium indoor amusement destination — arcade gaming, VR, social play, pop culture retail and collectibles under one roof.",
      el:"Το YAMATO είναι ο πρώτος premium κλειστός προορισμός διασκέδασης στην Ελλάδα — arcade, VR, social play, pop culture και collectibles κάτω από μία στέγη.",
      ja:"YAMATOはギリシャ初のプレミアム屋内アミューズメント施設です。アーケード、VR、ソーシャルプレイ、ポップカルチャー、コレクタブルを一つの屋根の下に。",
    },
  },
  {
    id:"2", category:"general", order:2,
    q:{ en:"How do I start playing?", el:"Πώς ξεκινάω να παίζω;", ja:"どうやって遊び始めますか？" },
    a:{
      en:"Get a rechargeable YAMATO Game Card at the cashier or vending machine. Load it and every credit becomes gameplay. No entry fee.",
      el:"Πάρε μια επαναφορτιζόμενη YAMATO Game Card από το ταμείο ή το μηχάνημα. Φόρτωσέ τη και κάθε credit γίνεται παιχνίδι. Χωρίς είσοδο.",
      ja:"レジまたは自動販売機で再チャージ式のYAMATOゲームカードを入手。チャージすればクレジットがそのまま遊びに。入場無料。",
    },
  },
  {
    id:"3", category:"general", order:3,
    q:{ en:"What age groups is YAMATO suitable for?", el:"Για ποιες ηλικίες είναι κατάλληλο;", ja:"対象年齢は？" },
    a:{
      en:"YAMATO is designed for all ages, with dedicated Kids zones, family areas and premium experiences for adults. Under 12s must be accompanied by an adult.",
      el:"Το YAMATO είναι για όλες τις ηλικίες, με ειδικές ζώνες Kids, οικογενειακούς χώρους και premium εμπειρίες για ενήλικες. Οι κάτω των 12 πρέπει να συνοδεύονται.",
      ja:"YAMATOは全年齢向け。キッズゾーン、ファミリーエリア、大人向けのプレミアム体験があります。12歳未満は保護者同伴が必要です。",
    },
  },
  {
    id:"4", category:"events", order:4,
    q:{ en:"Can I book YAMATO for a private event or party?", el:"Μπορώ να κλείσω το YAMATO για ιδιωτική εκδήλωση;", ja:"貸切やパーティーの予約はできますか？" },
    a:{
      en:"Yes! We offer group bookings and private event packages. Contact us or ask in-store for our events team.",
      el:"Ναι! Προσφέρουμε ομαδικές κρατήσεις και πακέτα ιδιωτικών εκδηλώσεων. Επικοινώνησε μαζί μας ή ρώτησε στο κατάστημα.",
      ja:"はい！グループ予約や貸切イベントパッケージをご用意しています。お問い合わせいただくか、店舗でイベントチームにお尋ねください。",
    },
    cta:{ to:"/contact?subject=Book%20an%20Event", label:{ en:"Book an Event", el:"Κράτηση Εκδήλωσης", ja:"イベント予約" } },
  },
  {
    id:"5", category:"general", order:5,
    q:{ en:"What payment methods do you accept?", el:"Ποιους τρόπους πληρωμής δέχεστε;", ja:"支払い方法は？" },
    a:{
      en:"In-store we accept cash and cards for the Game Card. In our online shop we currently support cash on delivery and bank transfer.",
      el:"Στο κατάστημα δεχόμαστε μετρητά και κάρτες για τη Game Card. Στο online shop υποστηρίζουμε προς το παρόν αντικαταβολή και τραπεζική κατάθεση.",
      ja:"店舗ではゲームカードに現金・カードが使えます。オンラインショップでは現在、代金引換と銀行振込に対応しています。",
    },
  },
  {
    id:"6", category:"gaming", order:6,
    q:{ en:"Do you sell Trading Card Games?", el:"Πουλάτε Trading Card Games;", ja:"トレーディングカードゲームは販売していますか？" },
    a:{
      en:"Yes! We stock Pokémon, Yu-Gi-Oh!, One Piece and more, and host regular tournaments.",
      el:"Ναι! Έχουμε Pokémon, Yu-Gi-Oh!, One Piece και άλλα, και διοργανώνουμε τακτικά τουρνουά.",
      ja:"はい！ポケモン、遊戯王、ワンピースなどを取り扱い、定期的にトーナメントも開催しています。",
    },
    // CTA to e-shop hidden for later: cta:{ to:"/shop?category=TCG", label:{ en:"Shop TCG", el:"Αγορά TCG", ja:"TCGを見る" } },
  },
  {
    id:"7", category:"passes", order:7,
    q:{ en:"What is the Summer Pass?", el:"Τι είναι το Summer Pass;", ja:"サマーパスとは？" },
    a:{
      en:"The Summer Pass gives unlimited play throughout the summer at any YAMATO location, plus exclusive perks and priority access.",
      el:"Το Summer Pass δίνει απεριόριστο παιχνίδι όλο το καλοκαίρι σε κάθε YAMATO, με αποκλειστικά προνόμια και προτεραιότητα.",
      ja:"サマーパスは夏の間、どのYAMATO店舗でも遊び放題。限定特典と優先アクセス付き。",
    },
  },
  {
    id:"8", category:"store", order:8,
    q:{ en:"Where are YAMATO locations?", el:"Πού βρίσκονται τα YAMATO;", ja:"YAMATOの店舗はどこですか？" },
    a:{
      en:"We're in Nea Erythraia (59 El. Venizelou St.) and Athens Center (4 Athinaidos St., opening soon).",
      el:"Βρισκόμαστε στη Νέα Ερυθραία (Ελ. Βενιζέλου 59) και στο Κέντρο Αθήνας (Αθηναΐδος 4, σύντομα).",
      ja:"ネア・エリスレア（El. Venizelou 59）とアテネ中心部（Athinaidos 4、近日オープン）にあります。",
    },
    cta:{ to:"/stores", label:{ en:"Find a Store", el:"Βρες Κατάστημα", ja:"店舗を探す" } },
  },
];
