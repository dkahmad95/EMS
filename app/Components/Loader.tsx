const Loader = ({ borderColor}:{borderColor: string}) => {
    return (

            <div className={`animate-spin rounded-full ml-auto h-5 w-5 border-t-4 border-b-4 border-${borderColor}-500`}></div>

    );
};

export default Loader;