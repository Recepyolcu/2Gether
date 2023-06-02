
export default function Hero() {

    return (
        <main className='relative h-screen max-sm:h-fit flex flex-col items-center justify-between 2xl:pt-40 lg:pt-72 py-60 max-sm:py-36 gap-64 xl:px-[180px] px-20 max-sm:px-5 dark:text-main_light'>
            <div className="flex max-lg:flex-col justify-between items-center">
                <div className="lg:w-1/2 flex flex-col gap-6">
                    <h1 className="effect font-gilroy font-bold 2xl:text-9xl xl:text-8xl text-8xl max-sm:text-6xl max-[400px]:text-4xl">2Gether</h1>
                    <p className="font-necto_mono text-2xl lg:text-xl max-lg:hidden">Herhangi bir ilginiz olsun, yürüyüş yapmaktan kitap okumaya, ağ oluşturmaktan beceri paylaşımına kadar binlerce kişiyle 2Gether’da paylaşabilirsiniz. Her gün, her alanda yapılan etkinliklere sen de katıl.</p>
                </div>
                <div className="lg:w-1/2 max-lg:w-10/12 max-sm:w-full flex justify-end">
                    <img className='w-11/12 max-sm:w-full' src="/img/friends.png" alt="friends" />
                </div>
                <p className="font-necto_mono lg:text-2xl lg:hidden max-md:pt-20 max-sm:text-sm max-[400px]:text-xs text-center">Herhangi bir ilginiz olsun, yürüyüş yapmaktan kitap okumaya, ağ oluşturmaktan beceri paylaşımına kadar binlerce kişiyle 2Gether’da paylaşabilirsiniz. Her gün, her alanda yapılan etkinliklere sen de katıl.</p>
            </div>
            <hr className='absolute bottom-8 w-5/12 border-[4px] rounded-full border-main_text dark:border-main_dark_orange'/>
        </main>
    )
}