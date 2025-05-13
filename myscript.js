// =====================================================
// GENEL DOM YÜKLENME OLAYI
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    // Adam Asmaca oyununu sadece ilgili sayfada başlat
    if (document.getElementById('oyunAlani')) {
        if (typeof oyunBaslat === 'function') {
            oyunBaslat();
        } else {
            console.warn("Adam Asmaca: oyunBaslat fonksiyonu bulunamadı.");
        }
    }

    // Gezi Planı Formu için olay dinleyici ekle (sadece ilgili sayfada)
    const geziPlaniFormuElementi = document.getElementById('geziPlaniFormu');
    if (geziPlaniFormuElementi) {
        // Sayfa yüklendiğinde mevcut planları localStorage'dan yükle
        planlariHafizadanYukle(); // Bu fonksiyon aşağıda tanımlı

        geziPlaniFormuElementi.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const planObjesi = {
                gidilecekYer: document.getElementById('gidilecekYer').value,
                baslangicTarihi: document.getElementById('baslangicTarihi').value,
                bitisTarihi: document.getElementById('bitisTarihi').value,
                konaklamaTuru: document.getElementById('konaklamaTuru').value,
                aktiviteler: document.getElementById('aktiviteler').value,
                butceTahmini: document.getElementById('butceTahmini').value,
                ekNotlar: document.getElementById('ekNotlar').value,
                id: Date.now() 
            };

            yeniGeziPlaniEkle(planObjesi); // Bu fonksiyon aşağıda tanımlı
            
            geziPlaniFormuElementi.reset(); 
        });
    }

    // Yorumları gösterme (index.html için)
    // Bu fonksiyonun index.html'in kendi <script> bloğunda veya
    // burada tanımlanmış olması gerekir.
    if (typeof yorumlariGoster === 'function' && document.getElementById('yorum-listesi')) {
        yorumlariGoster(); 
    } else if (document.getElementById('yorum-listesi')) {
        console.warn("Yorumlar: yorumlariGoster fonksiyonu bulunamadı ama yorum-listesi elementi var.");
    }
});


// =====================================================
// ADAM ASMACA OYUNU KODLARI
// =====================================================
const kelimeAlani_aa = document.getElementById('kelimeAlani'); // Adam asmaca için _aa eki
const kalanHakAlani_aa = document.getElementById('kalanHakAlani');
const yanlisHarflerAlani_aa = document.getElementById('yanlisHarflerAlani');
const mesajAlani_aa = document.getElementById('mesajAlani');
const klavyeAlani_aa = document.getElementById('klavye');
const yenidenBaslatBtn_aa = document.getElementById('yenidenBaslat');

const kelimeler_aa = [
    "İSTANBUL", "ANKARA", "İZMİR", "ANTALYA", "TRABZON", "NEVŞEHİR",
    "MUĞLA", "DENİZLİ", "ADIYAMAN", "KARABÜK", "KAPADOKYA", "PAMUKKALE",
    "EFES", "NEMRUT", "UZUNGÖL", "YEDİGÖLLER", "ŞİRİNCE", "SAFRANBOLU",
    "AKYAKA", "SEYAHAT", "GEZGİN", "TURİZM", "HARİTA", "ROTA", "VALİZ",
    "OTEL", "UÇAK", "KÜLTÜR", "TARİH", "DOĞA", "MANZARA"
];
const baslangicHakki_aa = 6;
const turkceHarfler_aa = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";

let secilenKelimeOyun_aa = '';
let dogruHarflerOyun_aa = [];
let yanlisHarflerOyun_aa = [];
let kalanHaklarOyun_aa = baslangicHakki_aa;
let oyunBitti_aa = false;

function kelimeSecOyun() {
    secilenKelimeOyun_aa = kelimeler_aa[Math.floor(Math.random() * kelimeler_aa.length)].toUpperCase();
    console.log("Adam Asmaca - Seçilen Kelime:", secilenKelimeOyun_aa);
}

function klavyeOlusturOyun() {
    if (!klavyeAlani_aa) return;
    klavyeAlani_aa.innerHTML = '';
    turkceHarfler_aa.split('').forEach(harf => {
        const button = document.createElement('button');
        button.textContent = harf;
        button.addEventListener('click', () => harfTahminEtOyun(harf, button));
        klavyeAlani_aa.appendChild(button);
    });
}

function kelimeGosterOyun() {
    if (!kelimeAlani_aa || !secilenKelimeOyun_aa) return;
    const gosterilecekKelime = secilenKelimeOyun_aa
        .split('')
        .map(harf => (dogruHarflerOyun_aa.includes(harf) ? harf : '_'))
        .join(' ');
    kelimeAlani_aa.textContent = gosterilecekKelime;
    if (secilenKelimeOyun_aa && !gosterilecekKelime.includes('_')) {
        oyunSonuOyun(true);
    }
}

function durumuGuncelleOyun() {
    if (!yanlisHarflerAlani_aa || !kalanHakAlani_aa) return;
    yanlisHarflerAlani_aa.textContent = `Yanlış Harfler: ${yanlisHarflerOyun_aa.join(', ')}`;
    kalanHakAlani_aa.textContent = `Kalan Hak: ${kalanHaklarOyun_aa}`;
    if (kalanHaklarOyun_aa <= 0) {
        oyunSonuOyun(false);
    }
}

function harfTahminEtOyun(harf, button) {
    if (oyunBitti_aa || !button || button.disabled) return;
    harf = harf.toUpperCase();
    if (dogruHarflerOyun_aa.includes(harf) || yanlisHarflerOyun_aa.includes(harf)) {
        return;
    }
    button.disabled = true;
    if (secilenKelimeOyun_aa && secilenKelimeOyun_aa.includes(harf)) {
        dogruHarflerOyun_aa.push(harf);
        kelimeGosterOyun();
    } else {
        yanlisHarflerOyun_aa.push(harf);
        kalanHaklarOyun_aa--;
        durumuGuncelleOyun();
    }
}

function oyunSonuOyun(kazandiMi) {
    if (!mesajAlani_aa || !klavyeAlani_aa || !yenidenBaslatBtn_aa) return;
    oyunBitti_aa = true;
    if (kazandiMi) {
        mesajAlani_aa.textContent = 'Tebrikler! Kazandınız! 🎉';
        mesajAlani_aa.style.color = 'green';
    } else {
        mesajAlani_aa.textContent = `Kaybettiniz! 😞 Doğru kelime: ${secilenKelimeOyun_aa}`;
        mesajAlani_aa.style.color = 'red';
    }
    klavyeAlani_aa.querySelectorAll('button').forEach(btn => {
        btn.disabled = true;
    });
    yenidenBaslatBtn_aa.style.display = 'inline-block';
}

function oyunBaslat() { // Bu fonksiyon globalde kalabilir, DOMContentLoaded içinde çağrılır
    if (!document.getElementById('oyunAlani')) return;
    console.log("Adam Asmaca oyunu başlatılıyor...");
    oyunBitti_aa = false;
    dogruHarflerOyun_aa = [];
    yanlisHarflerOyun_aa = [];
    kalanHaklarOyun_aa = baslangicHakki_aa;
    if (mesajAlani_aa) mesajAlani_aa.textContent = '';
    if (yenidenBaslatBtn_aa) yenidenBaslatBtn_aa.style.display = 'none';
    
    kelimeSecOyun();
    if (secilenKelimeOyun_aa) {
        klavyeOlusturOyun();
        kelimeGosterOyun();
        durumuGuncelleOyun();
    } else {
        if(kelimeAlani_aa) kelimeAlani_aa.textContent = "Kelime yüklenemedi!";
    }
}

if (yenidenBaslatBtn_aa) {
    yenidenBaslatBtn_aa.addEventListener('click', oyunBaslat);
}

// =====================================================
// Gezi Planı Yönetimi (Hafızada ve localStorage'da)
// =====================================================
let aktifGeziPlanlari = [];

function planlariHafizadanYukle() {
    const saklanmisPlanlar = localStorage.getItem('geziPlanlari');
    if (saklanmisPlanlar) {
        aktifGeziPlanlari = JSON.parse(saklanmisPlanlar);
        console.log("Gezi Planları: localStorage'dan yüklendi:", aktifGeziPlanlari);
    } else {
        aktifGeziPlanlari = [];
        console.log("Gezi Planları: localStorage'da kayıtlı plan bulunamadı.");
    }
}

function planlariLocalStorageKaydet() {
    localStorage.setItem('geziPlanlari', JSON.stringify(aktifGeziPlanlari));
    console.log("Gezi Planları: localStorage'a kaydedildi.");
}

function yeniGeziPlaniEkle(yeniPlan) {
    aktifGeziPlanlari.push(yeniPlan);
    planlariLocalStorageKaydet();
    alert('Gezi planınız başarıyla kaydedildi!');
}
// =====================================================
// KAYITLI GEZİ PLANLARINI GÖSTERME VE SİLME
// =====================================================

/**
 * Kaydedilmiş gezi planlarını alıp tabloya ekler.
 */
function planlariTablodaGoster() {
    const planlarTabloGovdesi = document.getElementById('planlarTabloGovdesi');
    const planYokMesaji = document.getElementById('planYokMesaji');
    const planlarTablosu = document.getElementById('planlarTablosu');

    // Bu elementler sadece kayitli-planlar.html'de olacağı için varlıklarını kontrol et
    if (!planlarTabloGovdesi || !planYokMesaji || !planlarTablosu) {
        return; // Gerekli elementler yoksa fonksiyondan çık
    }

    // planlariHafizadanYukle() zaten DOMContentLoaded'da çağrılıyor ve
    // aktifGeziPlanlari dizisini dolduruyor. Onu kullanalım.
    // Eğer aktifGeziPlanlari henüz yüklenmediyse (ihtimal dışı ama önlem), tekrar yükle.
    if (typeof aktifGeziPlanlari === 'undefined' || aktifGeziPlanlari.length === 0) {
         planlariHafizadanYukle(); // Eğer boşsa veya tanımsızsa tekrar yüklemeyi dene
    }
    
    planlarTabloGovdesi.innerHTML = ''; // Her seferinde tabloyu temizle

    if (aktifGeziPlanlari.length === 0) {
        planYokMesaji.style.display = 'block';
        planlarTablosu.style.display = 'none';
    } else {
        planYokMesaji.style.display = 'none';
        planlarTablosu.style.display = 'table';

        aktifGeziPlanlari.forEach(function(plan) { // index'e şimdilik gerek yok, id kullanıyoruz
            const satir = planlarTabloGovdesi.insertRow();
            
            satir.insertCell().textContent = plan.gidilecekYer || '-';
            // Tarih formatlaması
            const baslangicTarihi = plan.baslangicTarihi ? new Date(plan.baslangicTarihi).toLocaleDateString('tr-TR') : '-';
            satir.insertCell().textContent = baslangicTarihi;
            const bitisTarihi = plan.bitisTarihi ? new Date(plan.bitisTarihi).toLocaleDateString('tr-TR') : '-';
            satir.insertCell().textContent = bitisTarihi;

            satir.insertCell().textContent = plan.konaklamaTuru || '-';
            satir.insertCell().textContent = plan.aktiviteler || '-';
            satir.insertCell().textContent = plan.butceTahmini ? plan.butceTahmini + ' ₺' : '-';
            satir.insertCell().textContent = plan.ekNotlar || '-';
            
            const silmeHucresi = satir.insertCell();
            const silmeButonu = document.createElement('button');
            silmeButonu.textContent = 'Sil';
            silmeButonu.classList.add('plan-sil-btn'); // CSS ile stil vermek için class
            silmeButonu.onclick = function() {
                if (confirm("Bu planı silmek istediğinizden emin misiniz?")) {
                    geziPlaniniSil(plan.id);
                }
            };
            silmeHucresi.appendChild(silmeButonu);
        });
    }
}

/**
 * Belirtilen ID'ye sahip gezi planını siler.
 * @param {number} planId - Silinecek planın benzersiz ID'si.
 */
function geziPlaniniSil(planId) {
    // aktifGeziPlanlari dizisinden planı filtrele
    aktifGeziPlanlari = aktifGeziPlanlari.filter(function(plan) {
        return plan.id !== planId;
    });
    
    // localStorage'ı güncelle
    planlariLocalStorageKaydet(); 
    
    // Tabloyu yeniden çiz
    planlariTablodaGoster(); 
    
    alert('Plan başarıyla silindi!');
}

// DOMContentLoaded olayına planlariTablodaGoster çağrısını ekle
// Mevcut DOMContentLoaded fonksiyonunu genişleteceğiz.
// Bu yüzden bu script'i mevcut myscript.js'in sonuna ekle
// ve aşağıdaki DOMContentLoaded kısmını mevcut olanla birleştir.

// --- GÜNCELLENMİŞ DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function() {
    // Script ilk yüklendiğinde localStorage'daki planları yükle
    if (typeof planlariHafizadanYukle === 'function') {
        planlariHafizadanYukle();
    }

    // Adam Asmaca oyununu sadece ilgili sayfada başlat
    if (document.getElementById('oyunAlani')) {
        if (typeof oyunBaslat === 'function') {
            oyunBaslat();
        } else {
            console.warn("Adam Asmaca: oyunBaslat fonksiyonu bulunamadı.");
        }
    }

    // Gezi Planı Formu için olay dinleyici ekle (sadece ilgili sayfada)
    const geziPlaniFormuElementi = document.getElementById('geziPlaniFormu');
    if (geziPlaniFormuElementi) {
        geziPlaniFormuElementi.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const planObjesi = {
                gidilecekYer: document.getElementById('gidilecekYer').value,
                baslangicTarihi: document.getElementById('baslangicTarihi').value,
                bitisTarihi: document.getElementById('bitisTarihi').value,
                konaklamaTuru: document.getElementById('konaklamaTuru').value,
                aktiviteler: document.getElementById('aktiviteler').value,
                butceTahmini: document.getElementById('butceTahmini').value,
                ekNotlar: document.getElementById('ekNotlar').value,
                id: Date.now() 
            };
            yeniGeziPlaniEkle(planObjesi);
            geziPlaniFormuElementi.reset(); 
        });
    }

    // Kayıtlı planları tabloda göster (sadece ilgili sayfada)
    if (document.getElementById('planlarTabloGovdesi')) {
        if (typeof planlariTablodaGoster === 'function') {
            planlariTablodaGoster();
        } else {
            console.warn("Kayıtlı Planlar: planlariTablodaGoster fonksiyonu bulunamadı.");
        }
    }

    // Yorumları gösterme (index.html için)
    if (typeof yorumlariGoster === 'function' && document.getElementById('yorum-listesi')) {
        yorumlariGoster(); 
    } else if (document.getElementById('yorum-listesi')) {
        console.warn("Yorumlar: yorumlariGoster fonksiyonu bulunamadı ama yorum-listesi elementi var.");
    }
});
// Not: index.html için yorum ekleme/silme kodları bu dosyada değilse,
// index.html içindeki <script> bloklarında kalmalıdır. Eğer buraya taşınacaksa
// `DOMContentLoaded` içine ve ilgili ID kontrolleriyle eklenmelidir.
// Yukarıdaki `DOMContentLoaded` içinde `yorumlariGoster` için bir kontrol zaten var.