import useSWR from 'swr';

export const useGetAPI = <T>(url: string) => {

  // フェッチ関数
  const fetcher = async (url: string) => {

    // 認証トークン付きでリクエストを送信
    const res = await fetch(url, {
      headers: {
        // APIキーとか
        "X-API-Key": process.env.NEXT_PUBLIC_KAJILABSTORE_API_KEY!,
      },
    });
    if (!res.ok) throw new Error('API failed');
    return res.json();
  };

  // SWRを使ってデータ取得とキャッシュ
  const { data, error, isLoading } = useSWR<T>(url, fetcher);

  return { data, error, isLoading };
};