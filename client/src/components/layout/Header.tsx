import SearchBox from '../ui/SeachBox'


export const Header = () => {
    return (
        <header className="sticky top-0 z-20 flex justify-center bg-gray-800/95 py-3 backdrop-blur-xl sm:justify-end">
            <SearchBox />
        </header>
    )
}