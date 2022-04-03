import { useMemo } from 'react';

import { RouteComponentProps, Switch, useRouteMatch } from 'react-router-dom';

import { parseQueryString } from '@veupathdb/wdk-client/lib/Core/RouteEntry';
import WdkRoute from '@veupathdb/wdk-client/lib/Core/WdkRoute';

import UserDatasetsWorkspace from '../Components/UserDatasetsWorkspace';

import { makeDatasetUploadPageConfig } from '../Utils/upload-config';
import { DatasetUploadTypeConfig } from '../Utils/types';

import UserDatasetDetailController from './UserDatasetDetailController';

interface Props<T1 extends string = string, T2 extends string = string> {
  availableUploadTypes?: T1[];
  detailsPageTitle: string;
  helpRoute: string;
  uploadTypeConfig: DatasetUploadTypeConfig<T2>;
  workspaceTitle: string;
}

export function UserDatasetRouter<T1 extends string, T2 extends string>({
  availableUploadTypes,
  detailsPageTitle,
  helpRoute,
  uploadTypeConfig,
  workspaceTitle,
}: Props<T1, T2>) {
  const { path, url } = useRouteMatch();

  const uploadPageConfig = useMemo(
    () => makeDatasetUploadPageConfig(availableUploadTypes, uploadTypeConfig),
    [availableUploadTypes, uploadTypeConfig]
  );

  return (
    <Switch>
      <WdkRoute
        path={`${path}/:id(\\d+)`}
        requiresLogin
        component={(props: RouteComponentProps<{ id: string }>) => {
          return (
            <UserDatasetDetailController
              baseUrl={url}
              detailsPageTitle={detailsPageTitle}
              workspaceTitle={workspaceTitle}
              {...props.match.params}
            />
          );
        }}
      />
      <WdkRoute
        path={path}
        exact={false}
        requiresLogin={false} // uses custom guest views
        component={(props: RouteComponentProps<{}>) => (
          <UserDatasetsWorkspace
            baseUrl={url}
            helpRoute={helpRoute}
            uploadPageConfig={uploadPageConfig}
            // FIXME This should be memoized
            urlParams={parseQueryString(props)}
            workspaceTitle={workspaceTitle}
          />
        )}
      />
    </Switch>
  );
}
