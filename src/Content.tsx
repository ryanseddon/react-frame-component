import { Children, Component, ReactElement } from 'react';

type ContentProps = {
  children: ReactElement;
  contentDidMount?: () => void;
  contentDidUpdate?: () => void;
};

export default class Content extends Component<ContentProps> {
  componentDidMount() {
    this.props.contentDidMount?.();
  }

  componentDidUpdate() {
    this.props.contentDidUpdate?.();
  }

  render() {
    return Children.only(this.props.children);
  }
}
