import supabase from "config/supabaseClient";

export default async function getAuthToken() {
    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session || !session.access_token) {
        // Handle error
        console.error("Session or access token is undefined");
        return null;
      }
      return session.access_token;
    } catch (error) {
      // Handle error
      console.error("Error fetching session:", error.message);
      return null;
    }
  }
