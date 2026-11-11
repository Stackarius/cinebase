import SearchBox from '../ui/SeachBox'


export const Header = () => {
    return (
        <header className="sticky top-0 z-20 flex justify-end bg-gray-800/95 px-1 py-3 backdrop-blur-xl">
            <SearchBox />
        </header>
    )
}