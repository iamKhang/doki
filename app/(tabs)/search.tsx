import PostService from "@/services/PostService";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function SearchPage() {
  useEffect(() => {
    const fetchData = async () => {
      const p = new PostService();
      p.getAll().then((data) => console.log(data));
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>Welcome to the Search screen!</Text>
    </View>
  );
}
