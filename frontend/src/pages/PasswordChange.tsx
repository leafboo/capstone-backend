import resourcesApi from "../api/resources"

export default function PasswordChange() {

    async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const data = new FormData(form);

        const newPassword = data.get("newPassword") as string;
        const confirmNewPassword = data.get("confirmNewPassword") as string;

        if (newPassword === confirmNewPassword) {
            try {
                await resourcesApi.updateUserPassword(newPassword);
            } catch (err) {
                console.error(err);
            }
        }

        form.reset();
    }

    return (
        <>
            <form onSubmit={handleChangePassword}>
                <label htmlFor="">New Password</label>
                <input type="password" name="newPassword" className="border" required /> <br />
                <label htmlFor="" >Confirm Password</label>
                <input type="password" name="confirmNewPassword" className="border" required /><br />
                <button className="border border-black p-[.5rem] mt-[1.5rem] cursor-pointer">Confirm</button>
            </form>
        </>
    )
}