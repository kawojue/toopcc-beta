const SpinnerOne: React.FC = () => {
    return (
        <main className="w-full h-full flex justify-center mt-14">
            <article className="loading-spin">
                <div className="spin-sector spin-sector-1"></div>
                <div className="spin-sector spin-sector-2"></div>
                <div className="spin-sector spin-sector-3"></div>
            </article>
        </main>
    )
}

const SpinnerTwo: React.FC = () => {
    return (
        <main className="w-full h-full flex justify-center mt-14">
            <div className="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </main>
    )
}

export { SpinnerOne, SpinnerTwo }