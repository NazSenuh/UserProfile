export function content(code: number) {
    return    `<div>
        <h1><center>Password Recovering</center></h1>
    <h3>
        <center>
            To recover your password you should paste this code below
            in the specific field on website
        </center>
    </h3>
    <br/>
    <h3>
        <center>
            <strong>${code}</strong>
        </center>
    </h3>
    </div>`
}