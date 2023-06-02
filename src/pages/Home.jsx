import algoliasearch from "algoliasearch/lite"
import { InstantSearch, Highlight } from "react-instantsearch-dom"
import Hit from '../components/Hit'
import { connectSearchBox } from 'react-instantsearch-dom';
import { IoSearch } from 'react-icons/io5'
import { connectHits } from 'react-instantsearch-dom';
import Event from "../components/event";

const searchClient = algoliasearch(
    'BE7H63GVIG',
    '649b2e866a6455ec4bb44d89c94315da'
)

const CustomSearchBox = ({ currentRefinement, refine }) => (
    <label className="w-full relative">
        <input
            type="search"
            value={currentRefinement}
            placeholder="Etkinlik ara"
            onChange={event => refine(event.currentTarget.value)}
            className='w-full p-3 px-6 rounded-2xl font-normal bg-white border-2 border-main_light_dark dark:bg-transparent placeholder:text-neutral-400 dark:focus:placeholder:text-main_light outline-none dark:focus:bg-main_text anim-500 overflow-hidden'
            />
            <button className="absolute right-4 top-3.5"><IoSearch className="text-xl" /></button>
    </label>
);
const CustomHits = ({ hits }) => (
    <div className='gap-6 grid 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1'>
            {hits.map((event) => (
                <Event key={event.id} content={event} />
            ))}
    </div>
);
  
const Hits = connectHits(CustomHits);
const SearchBox = connectSearchBox(CustomSearchBox);
  

export default function Home() {

    return (
        <div className="w-full flex gap-5 p-5 bg-main_light sm:border-2 border-main_light_dark dark:bg-transparent rounded-3xl shadow-xl">
            <div className="flex flex-col gap-5">
                <InstantSearch searchClient={searchClient} indexName='events'>
                    <SearchBox />
                    <Hits hitComponent={Hit} />
                </InstantSearch>
            </div>
            <div className="w-1/3 border">

            </div>
        </div>
    )
}



                