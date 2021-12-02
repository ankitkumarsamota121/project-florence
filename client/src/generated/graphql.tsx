import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type BasicRecordResponse = {
  __typename?: 'BasicRecordResponse';
  category: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['Float'];
  title: Scalars['String'];
};

export type ConsentRequest = {
  __typename?: 'ConsentRequest';
  content: Scalars['String'];
  doctor: Doctor;
  id: Scalars['ID'];
  patient: Patient;
  record: Record;
};

export type Doctor = {
  __typename?: 'Doctor';
  designation: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  specialities: Scalars['String'];
};

export type DoctorInput = {
  designation: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  specialities: Scalars['String'];
};

export type MeResponse = {
  __typename?: 'MeResponse';
  user: User;
  userType: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addPatient: Scalars['Boolean'];
  createRecord: Record;
  createRequest: Scalars['Boolean'];
  deleteFile: Scalars['Boolean'];
  deleteRecord: Scalars['Boolean'];
  deleteRequest: Scalars['Boolean'];
  doctorRegister: UserResponse;
  grantAccess: Scalars['Boolean'];
  login: UserResponse;
  patientRegister: UserResponse;
  removePatient: Scalars['Boolean'];
  revokeAccess: Scalars['Boolean'];
  singleUpload: Scalars['String'];
  updateRecord?: Maybe<Record>;
};


export type MutationAddPatientArgs = {
  patientId: Scalars['String'];
};


export type MutationCreateRecordArgs = {
  attachmentId: Scalars['Int'];
  category: Scalars['String'];
  description: Scalars['String'];
  patientId?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  userType: Scalars['String'];
};


export type MutationCreateRequestArgs = {
  content: Scalars['String'];
  patientId: Scalars['String'];
  recordId: Scalars['Float'];
};


export type MutationDeleteFileArgs = {
  filename: Scalars['String'];
};


export type MutationDeleteRecordArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteRequestArgs = {
  id: Scalars['Int'];
};


export type MutationDoctorRegisterArgs = {
  input: DoctorInput;
};


export type MutationGrantAccessArgs = {
  doctorId: Scalars['String'];
  recordId: Scalars['Float'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  userType: Scalars['String'];
};


export type MutationPatientRegisterArgs = {
  input: PatientInput;
};


export type MutationRemovePatientArgs = {
  patientId: Scalars['String'];
};


export type MutationRevokeAccessArgs = {
  doctorId: Scalars['String'];
  recordId: Scalars['Float'];
};


export type MutationSingleUploadArgs = {
  file: Scalars['Upload'];
};


export type MutationUpdateRecordArgs = {
  category?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};

export type Patient = {
  __typename?: 'Patient';
  blood_group: Scalars['String'];
  email: Scalars['String'];
  gender: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type PatientInput = {
  blood_group: Scalars['String'];
  email: Scalars['String'];
  gender: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  doctors: Array<Doctor>;
  getConsentRequests: Array<ConsentRequest>;
  getPatientRecord: Record;
  getPatientRecords: Array<BasicRecordResponse>;
  getPatients: Array<Patient>;
  hello: Scalars['String'];
  me: MeResponse;
  patients: Array<Patient>;
  record?: Maybe<Record>;
  records: Array<Record>;
};


export type QueryGetPatientRecordArgs = {
  recordId: Scalars['Float'];
};


export type QueryGetPatientRecordsArgs = {
  patientId: Scalars['String'];
};


export type QueryRecordArgs = {
  id: Scalars['Int'];
};

export type Record = {
  __typename?: 'Record';
  category: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type User = Doctor | Patient;

export type UserResponse = {
  __typename?: 'UserResponse';
  accessToken: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  userType: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', accessToken: string } };

export type CreateRecordMutationVariables = Exact<{
  userType: Scalars['String'];
  attachmentId: Scalars['Int'];
  category: Scalars['String'];
  description: Scalars['String'];
  title: Scalars['String'];
  patientId?: InputMaybe<Scalars['String']>;
}>;


export type CreateRecordMutation = { __typename?: 'Mutation', createRecord: { __typename?: 'Record', title: string, id: string, category: string, description: string } };

export type PatientRegisterMutationVariables = Exact<{
  input: PatientInput;
}>;


export type PatientRegisterMutation = { __typename?: 'Mutation', patientRegister: { __typename?: 'UserResponse', accessToken: string } };

export type DoctorRegisterMutationVariables = Exact<{
  input: DoctorInput;
}>;


export type DoctorRegisterMutation = { __typename?: 'Mutation', doctorRegister: { __typename?: 'UserResponse', accessToken: string } };

export type SingleUploadMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type SingleUploadMutation = { __typename?: 'Mutation', singleUpload: string };

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = { __typename?: 'Query', hello: string };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'MeResponse', userType: string, user: { __typename?: 'Doctor', name: string, id: string, specialities: string, email: string, designation: string } | { __typename?: 'Patient', id: string, name: string, email: string, gender: string, blood_group: string } } };


export const LoginDocument = gql`
    mutation Login($userType: String!, $password: String!, $email: String!) {
  login(userType: $userType, password: $password, email: $email) {
    accessToken
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      userType: // value for 'userType'
 *      password: // value for 'password'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const CreateRecordDocument = gql`
    mutation CreateRecord($userType: String!, $attachmentId: Int!, $category: String!, $description: String!, $title: String!, $patientId: String) {
  createRecord(
    userType: $userType
    attachmentId: $attachmentId
    category: $category
    description: $description
    title: $title
    patientId: $patientId
  ) {
    title
    id
    category
    description
  }
}
    `;
export type CreateRecordMutationFn = Apollo.MutationFunction<CreateRecordMutation, CreateRecordMutationVariables>;

/**
 * __useCreateRecordMutation__
 *
 * To run a mutation, you first call `useCreateRecordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRecordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRecordMutation, { data, loading, error }] = useCreateRecordMutation({
 *   variables: {
 *      userType: // value for 'userType'
 *      attachmentId: // value for 'attachmentId'
 *      category: // value for 'category'
 *      description: // value for 'description'
 *      title: // value for 'title'
 *      patientId: // value for 'patientId'
 *   },
 * });
 */
export function useCreateRecordMutation(baseOptions?: Apollo.MutationHookOptions<CreateRecordMutation, CreateRecordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRecordMutation, CreateRecordMutationVariables>(CreateRecordDocument, options);
      }
export type CreateRecordMutationHookResult = ReturnType<typeof useCreateRecordMutation>;
export type CreateRecordMutationResult = Apollo.MutationResult<CreateRecordMutation>;
export type CreateRecordMutationOptions = Apollo.BaseMutationOptions<CreateRecordMutation, CreateRecordMutationVariables>;
export const PatientRegisterDocument = gql`
    mutation PatientRegister($input: PatientInput!) {
  patientRegister(input: $input) {
    accessToken
  }
}
    `;
export type PatientRegisterMutationFn = Apollo.MutationFunction<PatientRegisterMutation, PatientRegisterMutationVariables>;

/**
 * __usePatientRegisterMutation__
 *
 * To run a mutation, you first call `usePatientRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePatientRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [patientRegisterMutation, { data, loading, error }] = usePatientRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePatientRegisterMutation(baseOptions?: Apollo.MutationHookOptions<PatientRegisterMutation, PatientRegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PatientRegisterMutation, PatientRegisterMutationVariables>(PatientRegisterDocument, options);
      }
export type PatientRegisterMutationHookResult = ReturnType<typeof usePatientRegisterMutation>;
export type PatientRegisterMutationResult = Apollo.MutationResult<PatientRegisterMutation>;
export type PatientRegisterMutationOptions = Apollo.BaseMutationOptions<PatientRegisterMutation, PatientRegisterMutationVariables>;
export const DoctorRegisterDocument = gql`
    mutation DoctorRegister($input: DoctorInput!) {
  doctorRegister(input: $input) {
    accessToken
  }
}
    `;
export type DoctorRegisterMutationFn = Apollo.MutationFunction<DoctorRegisterMutation, DoctorRegisterMutationVariables>;

/**
 * __useDoctorRegisterMutation__
 *
 * To run a mutation, you first call `useDoctorRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDoctorRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [doctorRegisterMutation, { data, loading, error }] = useDoctorRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDoctorRegisterMutation(baseOptions?: Apollo.MutationHookOptions<DoctorRegisterMutation, DoctorRegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DoctorRegisterMutation, DoctorRegisterMutationVariables>(DoctorRegisterDocument, options);
      }
export type DoctorRegisterMutationHookResult = ReturnType<typeof useDoctorRegisterMutation>;
export type DoctorRegisterMutationResult = Apollo.MutationResult<DoctorRegisterMutation>;
export type DoctorRegisterMutationOptions = Apollo.BaseMutationOptions<DoctorRegisterMutation, DoctorRegisterMutationVariables>;
export const SingleUploadDocument = gql`
    mutation SingleUpload($file: Upload!) {
  singleUpload(file: $file)
}
    `;
export type SingleUploadMutationFn = Apollo.MutationFunction<SingleUploadMutation, SingleUploadMutationVariables>;

/**
 * __useSingleUploadMutation__
 *
 * To run a mutation, you first call `useSingleUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSingleUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [singleUploadMutation, { data, loading, error }] = useSingleUploadMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useSingleUploadMutation(baseOptions?: Apollo.MutationHookOptions<SingleUploadMutation, SingleUploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SingleUploadMutation, SingleUploadMutationVariables>(SingleUploadDocument, options);
      }
export type SingleUploadMutationHookResult = ReturnType<typeof useSingleUploadMutation>;
export type SingleUploadMutationResult = Apollo.MutationResult<SingleUploadMutation>;
export type SingleUploadMutationOptions = Apollo.BaseMutationOptions<SingleUploadMutation, SingleUploadMutationVariables>;
export const HelloDocument = gql`
    query Hello {
  hello
}
    `;

/**
 * __useHelloQuery__
 *
 * To run a query within a React component, call `useHelloQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelloQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelloQuery({
 *   variables: {
 *   },
 * });
 */
export function useHelloQuery(baseOptions?: Apollo.QueryHookOptions<HelloQuery, HelloQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
      }
export function useHelloLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HelloQuery, HelloQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
        }
export type HelloQueryHookResult = ReturnType<typeof useHelloQuery>;
export type HelloLazyQueryHookResult = ReturnType<typeof useHelloLazyQuery>;
export type HelloQueryResult = Apollo.QueryResult<HelloQuery, HelloQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    user {
      ... on Patient {
        id
        name
        email
        gender
        blood_group
      }
      ... on Doctor {
        name
        id
        specialities
        email
        designation
      }
    }
    userType
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;