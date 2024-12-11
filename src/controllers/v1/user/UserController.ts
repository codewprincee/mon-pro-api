import { UserService } from "../../../services/v1/UserService";

export class UserController {
    // ... existing methods ...

    // New method to get logged-in user data
    async getLoggedInUser(req: { user: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; error: unknown; }): any; new(): any; }; }; }) {
        try {
            const userId = req.user.id; // Assuming user ID is stored in req.user
            const userData = await UserService.getUserById(userId); // Fetch user data from service
            return res.status(200).json(userData);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving user data', error });
        }
    }
    // ... existing methods ...
}
