function CheckError(props)
{
    function renderError()
    {
        let {errors} = props
        if(Object.keys(errors).length > 0)
        {
            return Object.keys(errors).map((key , index ) => {
                return(
                    <p key={index }> {errors[key]}</p>
                )
            })
        }
    }
    return (
        <ul>
            {renderError()}
        </ul>
    )
}
export default CheckError;