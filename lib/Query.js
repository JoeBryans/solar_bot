import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useQueryFunction = (queryKey, queryFn, options) => {
    const queryClient = useQueryClient();
    const { data, isLoading, isError, error } = useQuery(queryKey, queryFn, options);
    return { data, isLoading, isError, error };
};

export const useMutationFunction = (queryKey, mutationFn, options) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: mutationFn,
        queryKey: queryKey,
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(queryKey);
        },
        onError: (error, variables, context) => {
            queryClient.invalidateQueries(queryKey);
        },
        // ...options,
    });
    return mutation;
};
