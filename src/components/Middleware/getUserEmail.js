import supabase from "config/supabaseClient";

export default async function getUserEmail() {
    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session || !session.user || !session.user.email) {
        // Handle error
        console.error("No Active Session");
        return null;
      }
      return session.user.email;
    } catch (error) {
      // Handle error
      console.error("Error fetching session email:", error.message);
      return null;
    }
}
