// Function to handle interactive elements (Mobile Navigation) and Typing Effect

document.addEventListener('DOMContentLoaded', () => {
    
    // ======================================
    // 1. Scroll to Top on Page Load (Reload Effect)
    // ======================================
    window.onload = function() {
        if (window.scrollY !== 0) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth' 
            });
        }
    };
    
    // ======================================
    // 2. Mobile Navigation Toggle
    // ======================================
    const navToggle = document.querySelector('.nav-toggle');
    const mainNavUl = document.querySelector('.main-nav ul');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    if (navToggle && mainNavUl) {
        navToggle.addEventListener('click', () => {
            mainNavUl.classList.toggle('nav-open');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNavUl.classList.contains('nav-open')) {
                mainNavUl.classList.remove('nav-open');
            }
        });
    });

    // ======================================
    // 3. Dynamic Repetitive Typing Effect 
    // ======================================
    
    const typingElement = document.getElementById('typing-text');
    
    // قائمة الجمل المراد تكرارها
    const phrases = [
        "Electronics & AI Student",
        "Front-end Developer", 
        "Autonomous Electronic Systems Specialist",
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    
    function typeText() {
        // نأخذ الجملة الحالية
        const currentText = phrases[phraseIndex];
        
        if (charIndex < currentText.length) {
            // نكتب الحرف التالي
            typingElement.textContent += currentText.charAt(charIndex);
            charIndex++;
            // سرعة الكتابة (40 مللي ثانية)
            setTimeout(typeText, 40); 
        } else {
            // عند الانتهاء من الكتابة، نخفي المؤشر وننتظر
            typingElement.classList.add('finished-typing'); 
            setTimeout(eraseText, 2000); // ننتظر 2 ثانية قبل الحذف
        }
    }
    
    function eraseText() {
        const currentText = phrases[phraseIndex];
        
        if (charIndex > 0) {
            // نحذف الحرف الأخير (تأثير لوحة المفاتيح)
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            // سرعة الحذف (30 مللي ثانية)
            setTimeout(eraseText, 30); 
        } else {
            // عند الانتهاء من الحذف
            typingElement.classList.remove('finished-typing');
            
            // ننتقل للجملة التالية (إذا وصلنا للنهاية نعود للأولى)
            phraseIndex = (phraseIndex + 1) % phrases.length;
            
            setTimeout(typeText, 200); // ننتظر 0.2 ثانية قبل بدء الكتابة الجديدة
        }
    }

    // بدء التأثير
    if (typingElement) {
        typeText(); 
    }
    
    // ======================================
    // 4. Scroll Reveal Effect (Observer API)
    // ======================================

    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null, // المراقبة من خلال إطار الرؤية (Viewport)
        rootMargin: '0px',
        threshold: 0.1 // عندما يظهر 10% من العنصر في الشاشة
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // إضافة الفئة التي تشغل حركة CSS
                entry.target.classList.add('visible');
                // إيقاف المراقبة بعد ظهور العنصر لمرة واحدة
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        // نطبق الحركة على الأقسام باستثناء الهيدر
        if (!section.classList.contains('hero-section')) {
            section.classList.add('scroll-reveal'); // أضف فئة للتحكم في ظهورها الأولي
            sectionObserver.observe(section);
        }
    });

    // ======================================
    // 5. Featured Projects Auto-Scroll Effect (Step-by-Step)
    // ======================================
    
    const projectsContainer = document.getElementById('projects-scroll-container');
    const projectCards = document.querySelectorAll('.project-card');
    
    // زمن الانتظار بين كل تمريرة (بالمللي ثانية) - يمكنك تعديله
    const intervalTime = 1500; 
    
    let currentProjectIndex = 0;
    let scrollIntervalId;
    let autoScrollPaused = false;

    if (projectsContainer && projectCards.length > 0) {
        
        // قيمة الفراغ بين البطاقات (ثابتة في CSS: 30px)
        const cardGap = 30;
        
        // دالة لحساب قيمة التمرير الديناميكية (عرض البطاقة + الفراغ)
        function calculateScrollAmount() {
            // نأخذ عرض أول بطاقة لتحديد المسافة، وهذا يضمن العمل مع vh/vw
            const firstCardWidth = projectCards[0].offsetWidth; 
            return firstCardWidth + cardGap;
        }
        
        // إجمالي عدد المشاريع
        const totalProjects = projectCards.length;

        function scrollNextProject() {
            if (autoScrollPaused) return;

            // إعادة حساب قيمة التمرير في كل مرة تحسباً لتغيير حجم الشاشة (في حال تم تدوير الهاتف مثلاً)
            const scrollAmount = calculateScrollAmount(); 

            // زيادة المؤشر للمشروع التالي
            currentProjectIndex = (currentProjectIndex + 1);
            
            // التحقق مما إذا كان المؤشر تجاوز آخر عنصر
            if (currentProjectIndex >= totalProjects) {
                currentProjectIndex = 0; // العودة إلى المشروع الأول
            }
            
            // تحديد موضع التمرير الجديد
            const newScrollLeft = currentProjectIndex * scrollAmount;

            projectsContainer.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth' // التمرير الناعم
            });
        }

        // بدء التمرير التلقائي
        scrollIntervalId = setInterval(scrollNextProject, intervalTime);

        // إيقاف التمرير عند تحريك الماوس فوق العناصر
        projectsContainer.addEventListener('mouseenter', () => {
            autoScrollPaused = true;
            clearInterval(scrollIntervalId); // إيقاف التمرير تماماً
        });
        
        // استئناف التمرير عند إبعاد الماوس
        projectsContainer.addEventListener('mouseleave', () => {
            autoScrollPaused = false;
            // استئناف التمرير بعد فترة وجيزة
            scrollIntervalId = setInterval(scrollNextProject, intervalTime); 
        });

        // إضافة دعم للمس (للهواتف) لإيقاف التمرير التلقائي مؤقتاً
        projectsContainer.addEventListener('touchstart', () => {
            autoScrollPaused = true;
            clearInterval(scrollIntervalId);
        });
        projectsContainer.addEventListener('touchend', () => {
            // استئناف التمرير بعد فترة وجيزة من انتهاء اللمس
            setTimeout(() => {
                autoScrollPaused = false;
                scrollIntervalId = setInterval(scrollNextProject, intervalTime);
            }, 1000); // 1 ثانية بعد إطلاق اللمس
        });
    }
});
