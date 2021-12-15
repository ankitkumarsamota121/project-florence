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

export type Attachment = {
  __typename?: 'Attachment';
  id: Scalars['ID'];
  url: Scalars['String'];
};

export type BasicRecordResponse = {
  __typename?: 'BasicRecordResponse';
  category: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['String'];
  isAuthorized: Scalars['Boolean'];
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
  createConsentRequest: Scalars['Boolean'];
  createRecord: Record;
  deleteConsentRequest: Scalars['Boolean'];
  deleteFile: Scalars['Boolean'];
  deleteRecord: Scalars['Boolean'];
  doctorRegister: UserResponse;
  grantAccess: Scalars['Boolean'];
  login: UserResponse;
  patientRegister: UserResponse;
  removePatient: Scalars['Boolean'];
  revokeAccess: Scalars['Boolean'];
  updateRecord?: Maybe<Record>;
  uploadFile: Scalars['Int'];
};


export type MutationAddPatientArgs = {
  patientEmail: Scalars['String'];
};


export type MutationCreateConsentRequestArgs = {
  content: Scalars['String'];
  patientId: Scalars['String'];
  recordId: Scalars['Float'];
};


export type MutationCreateRecordArgs = {
  attachmentId: Scalars['Int'];
  input: RecordInput;
  patientId?: InputMaybe<Scalars['String']>;
  userType: Scalars['String'];
};


export type MutationDeleteConsentRequestArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteFileArgs = {
  filename: Scalars['String'];
};


export type MutationDeleteRecordArgs = {
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


export type MutationUpdateRecordArgs = {
  category?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};


export type MutationUploadFileArgs = {
  file: Scalars['Upload'];
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
  getConsentRequests: Array<ConsentRequest>;
  getPatientRecord: Record;
  getPatientRecords: Array<BasicRecordResponse>;
  getPatients: Array<Patient>;
  getRecord?: Maybe<RecordResponse>;
  getRecords: Array<Record>;
  hello: Scalars['String'];
  me: MeResponse;
};


export type QueryGetPatientRecordArgs = {
  recordId: Scalars['Float'];
};


export type QueryGetPatientRecordsArgs = {
  patientId: Scalars['String'];
};


export type QueryGetRecordArgs = {
  id: Scalars['Int'];
};

export type Record = {
  __typename?: 'Record';
  category: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type RecordInput = {
  category: Scalars['String'];
  description: Scalars['String'];
  title: Scalars['String'];
};

export type RecordResponse = {
  __typename?: 'RecordResponse';
  attachments: Array<Attachment>;
  record: Record;
};

export type User = Doctor | Patient;

export type UserResponse = {
  __typename?: 'UserResponse';
  accessToken: Scalars['String'];
};

export type DoctorInfoFragment = { __typename?: 'Doctor', id: string, name: string, specialities: string, email: string, designation: string };

export type PatientInfoFragment = { __typename?: 'Patient', id: string, name: string, email: string, gender: string, blood_group: string };

export type RecordInfoFragment = { __typename?: 'Record', id: string, category: string, description: string, title: string };

export type AddPatientMutationVariables = Exact<{
  patientEmail: Scalars['String'];
}>;


export type AddPatientMutation = { __typename?: 'Mutation', addPatient: boolean };

export type CreateConsentRequestMutationVariables = Exact<{
  content: Scalars['String'];
  recordId: Scalars['Float'];
  patientId: Scalars['String'];
}>;


export type CreateConsentRequestMutation = { __typename?: 'Mutation', createConsentRequest: boolean };

export type GrantAccessMutationVariables = Exact<{
  recordId: Scalars['Float'];
  doctorId: Scalars['String'];
}>;


export type GrantAccessMutation = { __typename?: 'Mutation', grantAccess: boolean };

export type DeleteConsentRequestMutationVariables = Exact<{
  deleteConsentRequestId: Scalars['Int'];
}>;


export type DeleteConsentRequestMutation = { __typename?: 'Mutation', deleteConsentRequest: boolean };

export type CreateRecordMutationVariables = Exact<{
  userType: Scalars['String'];
  attachmentId: Scalars['Int'];
  input: RecordInput;
  patientId?: InputMaybe<Scalars['String']>;
}>;


export type CreateRecordMutation = { __typename?: 'Mutation', createRecord: { __typename?: 'Record', id: string, title: string, category: string, description: string } };

export type UploadFileMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadFileMutation = { __typename?: 'Mutation', uploadFile: number };

export type DoctorRegisterMutationVariables = Exact<{
  input: DoctorInput;
}>;


export type DoctorRegisterMutation = { __typename?: 'Mutation', doctorRegister: { __typename?: 'UserResponse', accessToken: string } };

export type PatientRegisterMutationVariables = Exact<{
  input: PatientInput;
}>;


export type PatientRegisterMutation = { __typename?: 'Mutation', patientRegister: { __typename?: 'UserResponse', accessToken: string } };

export type LoginMutationVariables = Exact<{
  userType: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', accessToken: string } };

export type GetPatientsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPatientsQuery = { __typename?: 'Query', getPatients: Array<{ __typename?: 'Patient', id: string, name: string, email: string, gender: string, blood_group: string }> };

export type GetPatientRecordsQueryVariables = Exact<{
  patientId: Scalars['String'];
}>;


export type GetPatientRecordsQuery = { __typename?: 'Query', getPatientRecords: Array<{ __typename?: 'BasicRecordResponse', id: string, title: string, description: string, category: string, isAuthorized: boolean }> };

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = { __typename?: 'Query', hello: string };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'MeResponse', userType: string, user: { __typename?: 'Doctor', id: string, name: string, specialities: string, email: string, designation: string } | { __typename?: 'Patient', id: string, name: string, email: string, gender: string, blood_group: string } } };

export type GetRecordsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecordsQuery = { __typename?: 'Query', getRecords: Array<{ __typename?: 'Record', id: string, category: string, description: string, title: string }> };

export type GetConsentRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetConsentRequestsQuery = { __typename?: 'Query', getConsentRequests: Array<{ __typename?: 'ConsentRequest', id: string, content: string, doctor: { __typename?: 'Doctor', id: string, name: string }, record: { __typename?: 'Record', id: string } }> };

export type GetRecordQueryVariables = Exact<{
  getRecordId: Scalars['Int'];
}>;


export type GetRecordQuery = { __typename?: 'Query', getRecord?: { __typename?: 'RecordResponse', record: { __typename?: 'Record', id: string, category: string, description: string, title: string }, attachments: Array<{ __typename?: 'Attachment', id: string, url: string }> } | null | undefined };

export const DoctorInfoFragmentDoc = gql`
    fragment DoctorInfo on Doctor {
  id
  name
  specialities
  email
  designation
}
    `;
export const PatientInfoFragmentDoc = gql`
    fragment PatientInfo on Patient {
  id
  name
  email
  gender
  blood_group
}
    `;
export const RecordInfoFragmentDoc = gql`
    fragment RecordInfo on Record {
  id
  category
  description
  title
}
    `;
export const AddPatientDocument = gql`
    mutation AddPatient($patientEmail: String!) {
  addPatient(patientEmail: $patientEmail)
}
    `;
export type AddPatientMutationFn = Apollo.MutationFunction<AddPatientMutation, AddPatientMutationVariables>;

/**
 * __useAddPatientMutation__
 *
 * To run a mutation, you first call `useAddPatientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPatientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPatientMutation, { data, loading, error }] = useAddPatientMutation({
 *   variables: {
 *      patientEmail: // value for 'patientEmail'
 *   },
 * });
 */
export function useAddPatientMutation(baseOptions?: Apollo.MutationHookOptions<AddPatientMutation, AddPatientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPatientMutation, AddPatientMutationVariables>(AddPatientDocument, options);
      }
export type AddPatientMutationHookResult = ReturnType<typeof useAddPatientMutation>;
export type AddPatientMutationResult = Apollo.MutationResult<AddPatientMutation>;
export type AddPatientMutationOptions = Apollo.BaseMutationOptions<AddPatientMutation, AddPatientMutationVariables>;
export const CreateConsentRequestDocument = gql`
    mutation CreateConsentRequest($content: String!, $recordId: Float!, $patientId: String!) {
  createConsentRequest(
    content: $content
    recordId: $recordId
    patientId: $patientId
  )
}
    `;
export type CreateConsentRequestMutationFn = Apollo.MutationFunction<CreateConsentRequestMutation, CreateConsentRequestMutationVariables>;

/**
 * __useCreateConsentRequestMutation__
 *
 * To run a mutation, you first call `useCreateConsentRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConsentRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConsentRequestMutation, { data, loading, error }] = useCreateConsentRequestMutation({
 *   variables: {
 *      content: // value for 'content'
 *      recordId: // value for 'recordId'
 *      patientId: // value for 'patientId'
 *   },
 * });
 */
export function useCreateConsentRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateConsentRequestMutation, CreateConsentRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateConsentRequestMutation, CreateConsentRequestMutationVariables>(CreateConsentRequestDocument, options);
      }
export type CreateConsentRequestMutationHookResult = ReturnType<typeof useCreateConsentRequestMutation>;
export type CreateConsentRequestMutationResult = Apollo.MutationResult<CreateConsentRequestMutation>;
export type CreateConsentRequestMutationOptions = Apollo.BaseMutationOptions<CreateConsentRequestMutation, CreateConsentRequestMutationVariables>;
export const GrantAccessDocument = gql`
    mutation GrantAccess($recordId: Float!, $doctorId: String!) {
  grantAccess(recordId: $recordId, doctorId: $doctorId)
}
    `;
export type GrantAccessMutationFn = Apollo.MutationFunction<GrantAccessMutation, GrantAccessMutationVariables>;

/**
 * __useGrantAccessMutation__
 *
 * To run a mutation, you first call `useGrantAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGrantAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [grantAccessMutation, { data, loading, error }] = useGrantAccessMutation({
 *   variables: {
 *      recordId: // value for 'recordId'
 *      doctorId: // value for 'doctorId'
 *   },
 * });
 */
export function useGrantAccessMutation(baseOptions?: Apollo.MutationHookOptions<GrantAccessMutation, GrantAccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GrantAccessMutation, GrantAccessMutationVariables>(GrantAccessDocument, options);
      }
export type GrantAccessMutationHookResult = ReturnType<typeof useGrantAccessMutation>;
export type GrantAccessMutationResult = Apollo.MutationResult<GrantAccessMutation>;
export type GrantAccessMutationOptions = Apollo.BaseMutationOptions<GrantAccessMutation, GrantAccessMutationVariables>;
export const DeleteConsentRequestDocument = gql`
    mutation DeleteConsentRequest($deleteConsentRequestId: Int!) {
  deleteConsentRequest(id: $deleteConsentRequestId)
}
    `;
export type DeleteConsentRequestMutationFn = Apollo.MutationFunction<DeleteConsentRequestMutation, DeleteConsentRequestMutationVariables>;

/**
 * __useDeleteConsentRequestMutation__
 *
 * To run a mutation, you first call `useDeleteConsentRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteConsentRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteConsentRequestMutation, { data, loading, error }] = useDeleteConsentRequestMutation({
 *   variables: {
 *      deleteConsentRequestId: // value for 'deleteConsentRequestId'
 *   },
 * });
 */
export function useDeleteConsentRequestMutation(baseOptions?: Apollo.MutationHookOptions<DeleteConsentRequestMutation, DeleteConsentRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteConsentRequestMutation, DeleteConsentRequestMutationVariables>(DeleteConsentRequestDocument, options);
      }
export type DeleteConsentRequestMutationHookResult = ReturnType<typeof useDeleteConsentRequestMutation>;
export type DeleteConsentRequestMutationResult = Apollo.MutationResult<DeleteConsentRequestMutation>;
export type DeleteConsentRequestMutationOptions = Apollo.BaseMutationOptions<DeleteConsentRequestMutation, DeleteConsentRequestMutationVariables>;
export const CreateRecordDocument = gql`
    mutation CreateRecord($userType: String!, $attachmentId: Int!, $input: RecordInput!, $patientId: String) {
  createRecord(
    userType: $userType
    attachmentId: $attachmentId
    input: $input
    patientId: $patientId
  ) {
    id
    title
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
 *      input: // value for 'input'
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
export const UploadFileDocument = gql`
    mutation UploadFile($file: Upload!) {
  uploadFile(file: $file)
}
    `;
export type UploadFileMutationFn = Apollo.MutationFunction<UploadFileMutation, UploadFileMutationVariables>;

/**
 * __useUploadFileMutation__
 *
 * To run a mutation, you first call `useUploadFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadFileMutation, { data, loading, error }] = useUploadFileMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadFileMutation(baseOptions?: Apollo.MutationHookOptions<UploadFileMutation, UploadFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadFileMutation, UploadFileMutationVariables>(UploadFileDocument, options);
      }
export type UploadFileMutationHookResult = ReturnType<typeof useUploadFileMutation>;
export type UploadFileMutationResult = Apollo.MutationResult<UploadFileMutation>;
export type UploadFileMutationOptions = Apollo.BaseMutationOptions<UploadFileMutation, UploadFileMutationVariables>;
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
export const GetPatientsDocument = gql`
    query GetPatients {
  getPatients {
    ...PatientInfo
  }
}
    ${PatientInfoFragmentDoc}`;

/**
 * __useGetPatientsQuery__
 *
 * To run a query within a React component, call `useGetPatientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPatientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPatientsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPatientsQuery(baseOptions?: Apollo.QueryHookOptions<GetPatientsQuery, GetPatientsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPatientsQuery, GetPatientsQueryVariables>(GetPatientsDocument, options);
      }
export function useGetPatientsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPatientsQuery, GetPatientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPatientsQuery, GetPatientsQueryVariables>(GetPatientsDocument, options);
        }
export type GetPatientsQueryHookResult = ReturnType<typeof useGetPatientsQuery>;
export type GetPatientsLazyQueryHookResult = ReturnType<typeof useGetPatientsLazyQuery>;
export type GetPatientsQueryResult = Apollo.QueryResult<GetPatientsQuery, GetPatientsQueryVariables>;
export const GetPatientRecordsDocument = gql`
    query GetPatientRecords($patientId: String!) {
  getPatientRecords(patientId: $patientId) {
    id
    title
    description
    category
    isAuthorized
  }
}
    `;

/**
 * __useGetPatientRecordsQuery__
 *
 * To run a query within a React component, call `useGetPatientRecordsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPatientRecordsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPatientRecordsQuery({
 *   variables: {
 *      patientId: // value for 'patientId'
 *   },
 * });
 */
export function useGetPatientRecordsQuery(baseOptions: Apollo.QueryHookOptions<GetPatientRecordsQuery, GetPatientRecordsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPatientRecordsQuery, GetPatientRecordsQueryVariables>(GetPatientRecordsDocument, options);
      }
export function useGetPatientRecordsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPatientRecordsQuery, GetPatientRecordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPatientRecordsQuery, GetPatientRecordsQueryVariables>(GetPatientRecordsDocument, options);
        }
export type GetPatientRecordsQueryHookResult = ReturnType<typeof useGetPatientRecordsQuery>;
export type GetPatientRecordsLazyQueryHookResult = ReturnType<typeof useGetPatientRecordsLazyQuery>;
export type GetPatientRecordsQueryResult = Apollo.QueryResult<GetPatientRecordsQuery, GetPatientRecordsQueryVariables>;
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
      ...PatientInfo
      ...DoctorInfo
    }
    userType
  }
}
    ${PatientInfoFragmentDoc}
${DoctorInfoFragmentDoc}`;

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
export const GetRecordsDocument = gql`
    query GetRecords {
  getRecords {
    ...RecordInfo
  }
}
    ${RecordInfoFragmentDoc}`;

/**
 * __useGetRecordsQuery__
 *
 * To run a query within a React component, call `useGetRecordsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecordsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecordsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRecordsQuery(baseOptions?: Apollo.QueryHookOptions<GetRecordsQuery, GetRecordsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecordsQuery, GetRecordsQueryVariables>(GetRecordsDocument, options);
      }
export function useGetRecordsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecordsQuery, GetRecordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecordsQuery, GetRecordsQueryVariables>(GetRecordsDocument, options);
        }
export type GetRecordsQueryHookResult = ReturnType<typeof useGetRecordsQuery>;
export type GetRecordsLazyQueryHookResult = ReturnType<typeof useGetRecordsLazyQuery>;
export type GetRecordsQueryResult = Apollo.QueryResult<GetRecordsQuery, GetRecordsQueryVariables>;
export const GetConsentRequestsDocument = gql`
    query GetConsentRequests {
  getConsentRequests {
    id
    content
    doctor {
      id
      name
    }
    record {
      id
    }
  }
}
    `;

/**
 * __useGetConsentRequestsQuery__
 *
 * To run a query within a React component, call `useGetConsentRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConsentRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConsentRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetConsentRequestsQuery(baseOptions?: Apollo.QueryHookOptions<GetConsentRequestsQuery, GetConsentRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetConsentRequestsQuery, GetConsentRequestsQueryVariables>(GetConsentRequestsDocument, options);
      }
export function useGetConsentRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetConsentRequestsQuery, GetConsentRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetConsentRequestsQuery, GetConsentRequestsQueryVariables>(GetConsentRequestsDocument, options);
        }
export type GetConsentRequestsQueryHookResult = ReturnType<typeof useGetConsentRequestsQuery>;
export type GetConsentRequestsLazyQueryHookResult = ReturnType<typeof useGetConsentRequestsLazyQuery>;
export type GetConsentRequestsQueryResult = Apollo.QueryResult<GetConsentRequestsQuery, GetConsentRequestsQueryVariables>;
export const GetRecordDocument = gql`
    query GetRecord($getRecordId: Int!) {
  getRecord(id: $getRecordId) {
    record {
      ...RecordInfo
    }
    attachments {
      id
      url
    }
  }
}
    ${RecordInfoFragmentDoc}`;

/**
 * __useGetRecordQuery__
 *
 * To run a query within a React component, call `useGetRecordQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecordQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecordQuery({
 *   variables: {
 *      getRecordId: // value for 'getRecordId'
 *   },
 * });
 */
export function useGetRecordQuery(baseOptions: Apollo.QueryHookOptions<GetRecordQuery, GetRecordQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecordQuery, GetRecordQueryVariables>(GetRecordDocument, options);
      }
export function useGetRecordLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecordQuery, GetRecordQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecordQuery, GetRecordQueryVariables>(GetRecordDocument, options);
        }
export type GetRecordQueryHookResult = ReturnType<typeof useGetRecordQuery>;
export type GetRecordLazyQueryHookResult = ReturnType<typeof useGetRecordLazyQuery>;
export type GetRecordQueryResult = Apollo.QueryResult<GetRecordQuery, GetRecordQueryVariables>;