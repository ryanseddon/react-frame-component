import { Children, Component, ReactNode } from 'react';

type ContentProps = {
  children?: ReactNode;
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
    const { children } = this.props;
    if (!children) return null;
    return Children.only(children);
  }
}
