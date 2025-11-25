import '../contador.css';
export const Contador=({numClics })=>{
    return(
        <div className='contador'>
            {numClics}
        </div>
    );
}