import { Injectable, signal } from '@angular/core';
import { Apollo, MutationResult, Query } from 'apollo-angular';
import {
  CREATE_USER_MUTATION,
  DELETE_USER_MUTATION,
  GET_USERS_COUNT_QUERY,
  GET_USERS_QUERY,
  UPDATE_USER_MUTATION,
} from '../gql/user-gql';
import { GQLQueryOptions } from '../models/GQLQueryOptions';
import { User } from '../models/User';
import { LocalStorageService } from './local-storage.service';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userSignal = signal<User | null>(null);
  usersSignal = signal<User[]>([]);
  filtersAppliedSignal = signal<boolean>(false);
  usersPerPage: number = 6;
  currentUsersPageSignal = signal<number>(1);
  queryOptions: GQLQueryOptions = new GQLQueryOptions();
  constructor(
    private localStorageService: LocalStorageService,
    private apollo: Apollo
  ) {
    this.queryOptions.limit = this.usersPerPage;
    this.queryOptions.page = 1;
    this.queryOptions.filters = {};
  }

  getCurrentUser(): User {
    return this.localStorageService.getItem('user');
  }

  setCurrentUser(user: User) {
    this.localStorageService.setItem('user', user);
    this.userSignal.set(user);
  }
  getUsersCount(options?: GQLQueryOptions): Observable<ApolloQueryResult<{ usersCount: number }>> {
    return this.apollo.watchQuery<{ usersCount: number }>({
      query: GET_USERS_COUNT_QUERY,
      variables: { options},
    }).valueChanges;
  }
  getUsers(
    options?: GQLQueryOptions,
    id?: string
  ): Observable<ApolloQueryResult<{ users: User[] }>> {
    return this.apollo.watchQuery<{ users: User[] }>({
      query: GET_USERS_QUERY,
      variables: {
        id: id,
        options
      },
    }).valueChanges;
  }
  createUser(
    role: string,
    password: string,
    email: string,
    lastName: string,
    firstName: string
  ): Observable<MutationResult<{ createUser: User }>> {
    return this.apollo.mutate<{ createUser: User }>({
      mutation: CREATE_USER_MUTATION,
      variables: {
        role: role,
        password: password,
        email: email,
        lastName: lastName,
        firstName: firstName,
      },
    });
  }
  updateUser(
    id: string,
    role: string,
    email: string,
    lastName: string,
    firstName: string,
    verified: boolean,
    password: string|null
  ): Observable<MutationResult<{ updateUser: User }>> {
    return this.apollo.mutate<{ updateUser: User }>({
      mutation: UPDATE_USER_MUTATION,
      variables: {
        id,
        role,
        password,
        email,
        lastName,
        firstName,
        verified
      },
    });
  }
  deleteUser(
    id: string
  ): Observable<MutationResult<{ deleteUser: boolean }>> {
    return this.apollo.mutate<{ deleteUser: boolean }>({
      mutation: DELETE_USER_MUTATION,
      variables: {
        id,
      },
    });
  }
}
