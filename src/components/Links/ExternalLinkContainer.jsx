export default function main(props){    

    return(
        <>
            <div className = "linkContainer">                    
                <div className = "allLinks">
                    {props.children}
                </div>
            </div>
        </>
    )
}