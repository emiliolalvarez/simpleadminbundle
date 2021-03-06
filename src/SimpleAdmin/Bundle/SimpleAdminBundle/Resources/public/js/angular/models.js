angular.module('simpleadmin.models', ['ngResource'])
    .factory('User', [
        '$resource', function($resource) {
            return $resource(/*Routing.getBaseUrl() +*/ '/r/api/users/:userId/:verb', {
                userId: '@id'
            },
            {
                recommendperson: {
                    method: "PATCH",
                    params: {
                        verb: 'recommendperson'
                    }
                },
                colleagues: {
                    method: "GET",
                    isArray: true,
                    params: {
                        verb: 'colleagues'
                    }
                },
                inviteperson: {
                    method: "PATCH",
                    params: {
                        verb: 'inviteperson'
                    }
                }
            });
        }
    ])
    .factory('ManagedEntity', [
        '$resource', function($resource) {
            return $resource(Routing.generate('api_get_managed_entities')/*+'/:workId/:verb'*/,
                {
                   /* workId: '@id'*/
                },
                {
                managedentities: {
                    method: "GET",
                    isArray: true,
                    params: {
                        verb: 'managedentities'
                    }
                }
            });
        }
    ])
    .factory('ListingWindow', [
        '$resource', function($resource) {
            return $resource(Routing.getBaseUrl()+'/api/listings/:repository/window',
                {
                    repository: '@repository'
                },
                {
                    listing: {
                        method: "GET",
                        isArray: false,
                        params: {
                            verb: 'listing',
                            page: '@page',
                            filters: '@filters'
                        }
                    }
                });
        }
    ])
    .factory('Management', [
      '$resource', function($resource) {
        return $resource(Routing.getBaseUrl()+'/api/repositories/:repository/records/:id',
          {
            repository: '@repository',
            id: '@id'
          },
          {
            retrieve: {
              method: "GET",
              isArray: false,
              params: {
                verb: 'get'
              }
            }
          },
          {
            save: {
              method: "POST",
              isArray: false,
              params: {
                verb: 'save'
              }
            }
          },
          {
            update: {
              method: "PUT",
                isArray: false,
                params: {
                verb: 'update'
              }
            }
          }
        );
      }
    ]);
