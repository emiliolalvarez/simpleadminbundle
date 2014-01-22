<?php

namespace SimpleAdmin\Bundle\SimpleAdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class SimpleAdminController extends Controller
{
    /**
     * @Route("/")
     * @Template()
     */
    public function indexAction()
    {
        #return $this->render("SimpleAdminBundle:Default:index.html.twig",array("test"=>1));
        return array();
    }

  /**
   * @Route("/template/window/listing")
   * @Template()
   */
    public function listingWindowTemplateAction(Request $request){

        return array(
          'windowId'=>$request->query->get('windowId'),
          'totalPages'=>$request->query->get('totalPages'),
          'currentPage'=>$request->query->get('currentPage')
        );

    }

}