import { motion } from 'framer-motion'

export default function InfoSection() {
    return (
        <section className="xl:px-[180px] sm:px-20 max-sm:px-10 bg-main_light dark:bg-main_dark dark:text-main_light py-20 flex flex-col gap-32">
            <h2 className="font-gilroy font-bold text-6xl max-sm:text-center max-sm:text-3xl text-main_text dark:text-main_light">2Gether ile</h2>
            <div className="w-full flex max-lg:flex-col max-lg:gap-20 justify-between ">
                <div className="flex flex-col max-sm:items-center gap-2 max-sm:text-center lg:w-3/12 max-lg:w-full">
                    <img className="rounded-xl aspect-video w-7/12 max-sm:w-9/12 sm:w-full object-cover" src="img/pexels-picnic.jpg" alt="picnic" />
                    <h4 className="font-bold text-xl max-lg:text-2xl max-sm:text-xl">Yeni Arkadaşlar Edin</h4>
                    <p className='max-sm:text-sm'>Aynı ilgi alanlarına sahip insanlarla tanış çevreni genişlet.</p>
                </div>
                <div className="flex flex-col max-sm:items-center gap-2 max-sm:text-center lg:w-3/12 max-lg:w-full">
                    <img className="rounded-xl aspect-video w-7/12 max-sm:w-9/12 sm:w-full object-cover" src="img/pexels-hiking.jpg" alt="hiking" />
                    <h4 className="font-bold text-xl max-lg:text-2xl max-sm:text-xl">Kendi Etkinliğini Oluştur</h4>
                    <p className='max-sm:text-sm'>Etkinliğin konusunu, yerini, katılacak kişi sayısını belirle ve etkinliğini oluştur.</p>
                </div>
                <div className="flex flex-col max-sm:items-center gap-2 max-sm:text-center lg:w-3/12 max-lg:w-full">
                    <img className="rounded-xl aspect-video w-7/12 max-sm:w-9/12 sm:w-full object-cover" src="img/pexels-club.jpg" alt="concert" />
                    <h4 className="font-bold text-xl max-lg:text-2xl max-sm:text-xl">Etkinliklere Katıl</h4>
                    <p className='max-sm:text-sm'>Çevrende yapılacak etkinleri gör, filtrele ve sana en uygun etkinliğe katıl.</p>
                </div>
            </div>
            <motion.a href='/login' whileHover={{scale: 1.1}} transition={{ duration: 0.3 }} className="px-44 max-sm:px-10 py-4 bg-white dark:bg-main_text border-main_text dark:border-main_light rounded-xl shadow-xl text-center font-gilroy font-bold text-xl max-sm:text-base border-[3px] ">Hesap Oluştur</motion.a>
        </section>
    )
}