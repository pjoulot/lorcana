<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\EventSubscriber;

use Drupal\Core\Url;
use Drupal\lorcana_cards\Search\CardSearchSyntax;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Expands a typed encyclopedia search into the real facet UI.
 *
 * A search such as `?search=ink:amber t:character` is translated to the
 * equivalent facet selection (`?f[0]=ink:1&f[1]=type:character`) and the
 * visitor is redirected there, so the matching checkboxes tick themselves,
 * the active-filter chips and "Clear all" appear, and the facet lists stay
 * consistent — instead of the search silently narrowing results with no way
 * to see or reset it. Tokens with no facet (lore/strength/…) and free text
 * stay behind as the residual `search` keys.
 */
final class SearchSyntaxRedirectSubscriber implements EventSubscriberInterface {

  public function __construct(
    private readonly CardSearchSyntax $syntax,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents(): array {
    // Run after the router has set _route (RouterListener is priority 32).
    return [KernelEvents::REQUEST => [['onRequest', 30]]];
  }

  /**
   * Redirects a token-bearing search to its facet-parameter equivalent.
   */
  public function onRequest(RequestEvent $event): void {
    if (!$event->isMainRequest()) {
      return;
    }
    $request = $event->getRequest();
    if ($request->attributes->get('_route') !== 'view.cards.page_1') {
      return;
    }

    $search = $request->query->get('search');
    if (!is_string($search) || trim($search) === '') {
      return;
    }

    $expanded = $this->syntax->expandToFacets($search);
    // Nothing mapped to a facet — leave the plain search query untouched.
    if (!$expanded['facets']) {
      return;
    }

    $query = $request->query->all();
    $existing = (isset($query['f']) && is_array($query['f'])) ? $query['f'] : [];
    $query['f'] = array_values(array_unique(array_merge($existing, $expanded['facets'])));
    if ($expanded['search'] !== '') {
      $query['search'] = $expanded['search'];
    }
    else {
      unset($query['search']);
    }
    // A fresh search starts at the first page.
    unset($query['page']);

    $url = Url::fromRoute('view.cards.page_1', [], ['query' => $query])
      ->toString(TRUE)
      ->getGeneratedUrl();
    $event->setResponse(new RedirectResponse($url, 302));
  }

}
